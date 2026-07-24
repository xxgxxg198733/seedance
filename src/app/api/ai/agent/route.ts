import { NextResponse } from "next/server";

const DEEPSEEK_BASE = "https://api.deepseek.com/v1";
const ARK_BASE = "https://ark.cn-beijing.volces.com/api/v3";

const SYSTEM_PROMPT = `You are Seedance creative assistant. Help users generate images and videos. You can receive reference images.

You can:
- Call generate_image to create images from text descriptions. If the user uploaded a reference image, use it as style reference.
- Call generate_video to create videos from text descriptions. If the user uploaded a reference image, use it as the starting frame.

Rules:
1. Always reply in the same language as the user
2. If user's description is vague, enhance it for better results
3. After generation, inform the user and briefly describe the result`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "generate_image",
      description: "Generate an image from a text prompt. Call when user wants to create/draw/generate an image.",
      parameters: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Detailed image description, the more detailed the better" },
          aspectRatio: { type: "string", enum: ["1:1", "16:9", "9:16"] },
          resolution: { type: "string", enum: ["2K", "1K"] },
        },
        required: ["prompt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_video",
      description: "Generate a video from a text prompt. Call when user wants to create/make/generate a video.",
      parameters: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Detailed video description, the more detailed the better" },
          aspectRatio: { type: "string", enum: ["16:9", "9:16", "1:1"] },
          duration: { type: "number", enum: [5, 10, 15] },
        },
        required: ["prompt"],
      },
    },
  },
];

async function callDeepSeek(messages: Record<string, unknown>[]) {
  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({ model: "deepseek-chat", messages, tools: TOOLS, tool_choice: "auto" }),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json() as Promise<{
    choices: Array<{
      message: { role: string; content: string | null; tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }> };
      finish_reason: string;
    }>;
  }>;
}

async function executeImageGen(
  prompt: string, aspectRatio = "1:1", resolution = "2K",
  referenceImage?: string
) {
  const body: Record<string, unknown> = {
    model: "doubao-seedream-5-0-260128",
    prompt, response_format: "url", size: resolution,
    stream: false, watermark: true, sequential_image_generation: "disabled",
  };
  if (referenceImage) body.image = referenceImage;

  const res = await fetch(`${ARK_BASE}/images/generations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.VOLCANO_ARK_API_KEY}` },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { data: Array<{ url: string }> };
  if (!res.ok || !data.data?.[0]?.url) throw new Error(`Image gen failed: ${JSON.stringify(data)}`);
  return data.data[0].url;
}

async function executeVideoGen(
  prompt: string, aspectRatio = "16:9", duration = 5,
  referenceImage?: string
) {
  const key = process.env.VOLCANO_ARK_API_KEY!;
  const content: Record<string, unknown>[] = [{ type: "text", text: prompt }];
  if (referenceImage) {
    content.push({ type: "image_url", image_url: { url: referenceImage }, role: "reference_image" });
  }

  const submit = await fetch(`${ARK_BASE}/contents/generations/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "doubao-seedance-2-0-260128", content, generate_audio: true, ratio: aspectRatio, duration, watermark: false }),
  });
  const sData = (await submit.json()) as { data: { task_id: string } };
  if (!sData.data?.task_id) throw new Error(`Video submit failed: ${JSON.stringify(sData)}`);

  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const poll = await fetch(`${ARK_BASE}/contents/generations/tasks/${sData.data.task_id}`, { headers: { Authorization: `Bearer ${key}` } });
    const pData = (await poll.json()) as { data: { status: string; output: Array<{ type: string; video_url?: { url: string } }> } };
    if (pData.data?.status === "completed") {
      const v = pData.data.output?.find((o) => o.type === "video_url");
      if (v?.video_url?.url) return v.video_url.url;
      throw new Error("Completed but no URL");
    }
    if (pData.data?.status === "failed") throw new Error("Video generation failed");
  }
  throw new Error("Video generation timed out");
}

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as {
      messages: Array<{ role: string; content: string; images?: string[] }>;
    };
    if (!messages?.length) return NextResponse.json({ error: "messages required" }, { status: 400 });

    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const referenceImage = lastUserMsg?.images?.[0];
    const origin = request.headers.get("origin") ?? "https://deepseekaiagent.com";
    const refUrl = referenceImage
      ? (referenceImage.startsWith("http") ? referenceImage : `${origin}${referenceImage}`)
      : undefined;

    const llmMessages = messages.map((m) => {
      let content = m.content;
      if (m.images?.length && !content) content = "[User uploaded a reference image]";
      if (m.images?.length && content) content = `[Reference image uploaded] ${content}`;
      return { role: m.role, content };
    });

    const conversation = [{ role: "system", content: SYSTEM_PROMPT }, ...llmMessages];

    const llmData = await callDeepSeek(conversation);
    const choice = llmData.choices?.[0];
    if (!choice) throw new Error("No response");

    if (choice.finish_reason === "tool_calls" && choice.message.tool_calls?.length) {
      const tc = choice.message.tool_calls[0];
      const args = JSON.parse(tc.function.arguments);
      let toolResult: string;

      console.log(`🔧 ${tc.function.name}(${JSON.stringify(args)}) ref=${refUrl ?? "none"}`);

      if (tc.function.name === "generate_image") {
        const url = await executeImageGen(args.prompt, args.aspectRatio, args.resolution, refUrl);
        toolResult = JSON.stringify({ type: "image", url, prompt: args.prompt });
      } else if (tc.function.name === "generate_video") {
        const url = await executeVideoGen(args.prompt, args.aspectRatio, args.duration, refUrl);
        toolResult = JSON.stringify({ type: "video", url, prompt: args.prompt });
      } else {
        return NextResponse.json({ role: "assistant", content: `Unsupported action: ${tc.function.name}`, toolResult: null });
      }

      console.log("✅ Generated successfully");

      const followUp = [
        ...conversation,
        { role: "assistant", content: null, tool_calls: [tc] },
        { role: "tool", tool_call_id: tc.id, content: toolResult },
      ];
      const followData = await callDeepSeek(followUp);

      return NextResponse.json({
        role: "assistant",
        content: followData.choices?.[0]?.message?.content ?? "Done!",
        toolResult: JSON.parse(toolResult),
      });
    }

    return NextResponse.json({
      role: "assistant",
      content: choice.message.content ?? "Got it — what would you like to create?",
      toolResult: null,
    });
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Agent failed" },
      { status: 500 }
    );
  }
}
