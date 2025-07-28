import { type Request, type Response } from "express";
import prisma from "../utils/prisma";

export const createNote = async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  try {
    const note = await prisma.note.create({
      data: { text, userId: (req.user as any).id },
    });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: (req.user as any).id },
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.note.delete({
      where: { id, userId: (req.user as any).id },
    });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
};
