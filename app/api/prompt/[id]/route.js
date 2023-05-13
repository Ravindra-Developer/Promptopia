import { connectToDB } from "@utility/database/conn.js";
import Prompt from "@models/prompt";

// GET (read)
export const GET = async (req, { params }) => {
    try {
        await connectToDB();
        const prompt = await Prompt.findById(params.id).populate('creator');
        if (prompt) {
            return new Response(JSON.stringify(prompt), { status: 200 })
        } else {
            return new Response('Prompt Not Found', { status: 404 })
        }
    } catch (error) {
        return new Response('Failed to fetch prompts', { status: 500 })
    }
}

// PATCH (update)
export const PATCH = async (req, { params }) => {
    const { prompt, tag } = await req.json()
    try {
        await connectToDB();
        const PromptExist = await Prompt.findById(params.id)
        if (PromptExist) {
            PromptExist.prompt = prompt
            PromptExist.tag = tag
            await PromptExist.save()
            return new Response(JSON.stringify(PromptExist, { status: 200 }))
        } else {
            return new Response("No prompt Found", { status: 404 })
        }
    } catch (error) {
        return new Response('Failed to Update prompts', { status: 500 })
    }
}

// DELETE (delete)

export const DELETE = async (req, { params }) => {
    try {
        await connectToDB();
        await Prompt.findByIdAndRemove(params.id)
        return new Response('Prompt deleted successfully', { status: 200 })
    } catch (error) {
        return new Response('Failed to Delete prompts', { status: 500 })
    }
}  