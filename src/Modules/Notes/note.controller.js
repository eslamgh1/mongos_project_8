import { Router } from "express";
import * as noteService from "./note.service.js" 

const noteRouter = Router();


noteRouter.post("/create",noteService.createnote)
noteRouter.patch("/:noteId",noteService.updateNote)
noteRouter.put("/replace/:noteId",noteService.replaceNote)
noteRouter.patch("/update/all",noteService.updateAll)
noteRouter.delete("/delete/:noteId",noteService.deleteNote)
noteRouter.get("/paginate-sort",noteService.paginatedNotes)
noteRouter.get("/:id",noteService.getNoteById)
// noteRouter.get("/getnotes",noteService.getNotesUsers)


export default noteRouter;