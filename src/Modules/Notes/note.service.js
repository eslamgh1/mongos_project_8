import noteModel from "../../DB/Models/note.model.js";
import userModel from "../../DB/Models/user.model.js";

// import bcrypt from "bcrypt";
// import CryptoJS from "crypto-js";

import jwt from "jsonwebtoken";

// find => [{}], []
// findOne =>  {} , null
//findById => {} , null
//& 1.Create a Single Note
export const createnote = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { title, content } = req.body;

    console.log({ headers: req.headers, authorization });

    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded);

    // findOne => Find user by Id in userModel
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const note = await noteModel.create({
      title,
      content,
      userId: decoded.id,
    });

    return res
      .status(201)
      .json({ message: "Note is created successfully", note });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

//& 2.Update a single Note by its id

export const updateNote = async (req, res) => {
  try {
    const { authorization } = req.headers; // user ID
    // console.log({ headers: req.headers, authorization });

    const { title, content } = req.body; // note
    const { noteId } = req.params; //note ID

    // findOne => Find user by Id in userModel
    const findNote = await noteModel.findById(noteId);
    if (!findNote) {
      return res.status(400).json({ message: "Note not found" });
    }
    console.log(findNote.userId);
    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded.id);

    if (decoded.id != findNote.userId) {
      return res.status(400).json({ message: "You are not the owner" });
    }

    const updatedNote = await noteModel.findOneAndUpdate(
      { _id: noteId }, // condition ==> search in collection
      { title, content },
      { new: true }
    );

    return res.status(201).json({ message: "Note is update", updatedNote });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

//& 3.Replace the entire note document with the new data

export const replaceNote = async (req, res) => {
  try {
    const { authorization } = req.headers; // user ID
    // console.log({ headers: req.headers, authorization });

    const { title, content } = req.body; // note
    const { noteId } = req.params; //note ID

    // findOne => Find user by Id in userModel
    const findNote = await noteModel.findById(noteId);
    if (!findNote) {
      return res.status(400).json({ message: "Note not found" });
    }
    console.log(findNote.userId);
    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded.id);

    if (decoded.id != findNote.userId) {
      return res.status(400).json({ message: "You are not the owner" });
    }

    //  Replacement so I have to (handle schema)
    const replacedNote = await noteModel.findOneAndReplace(
      { _id: noteId }, // condition ==> search in collection
      {
        title: title.trim().toLowerCase(),
        content: content.trim(),
        userId: decoded.id,
      },
      {
        new: true,
      }
    );

    return res.status(201).json({ message: "Note is update", replacedNote });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

//& 4.Updates the title of all notes created by a logged-in user
export const updateAll = async (req, res) => {
  try {
    const { authorization } = req.headers; // user ID
    // console.log({ headers: req.headers, authorization });

    const { title } = req.body; // note
    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded.id);

    const userHasNotes = await noteModel.findOne({ userId: decoded.id });
    if (!userHasNotes) {
      return res.status(404).json({ message: "No notes found" });
    }
    //  upadte All titles
    const updateAllTitles = await noteModel.updateMany(
      { userId: decoded.id }, // Filter
      { $set: { title } } // Update: set 'title' to newTitle
    );

    return res
      .status(201)
      .json({ message: "All notes updated", updateAllTitles });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
//& 5.Delete a single Note by its id and return the deleted note.

export const deleteNote = async (req, res) => {
  try {
    const { authorization } = req.headers; // user ID
    // // console.log({ headers: req.headers, authorization });

    const { noteId } = req.params; //note ID

    // // findOne => Find user by Id in userModel
    const findNote = await noteModel.findById(noteId);
    if (!findNote) {
      return res.status(400).json({ message: "Note not found" });
    }
    console.log(findNote.userId);

    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded.id);

    if (decoded.id != findNote.userId) {
      return res.status(400).json({ message: "You are not the owner" });
    }

    // // 1-deleteOne => to check and return deletedCount
    // const deleteOneResult = await noteModel.deleteOne({ _id: noteId });
    // //check if existed
    // if (!deleteOneResult.deletedCount) {
    //   return res.status(401).json({ message: "note not found" });
    // }

    // 2-findByIdAndDelete => return object has been deleted
    const deleteOneResult = await noteModel.findByIdAndDelete(noteId);
    //check if existed
    if (!deleteOneResult) {
      return res.status(401).json({ message: "note not found" });
    }

    return res
      .status(201)
      .json({ message: "Note is deleted", deleteOneResult });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", erro: error.message });
  }
};

//&  6. Retrieve a paginated list of notes for the logged-in user,

export const paginatedNotes = async (req, res) => {
  try {
    const { authorization } = req.headers; // user ID
    // const { limit } = req.queryParams;

    // // console.log({ headers: req.headers, authorization });

    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded.id);

    const findUser = await noteModel.find({ userId: decoded.id });

    if (!findUser) {
      return res.status(400).json({ message: "You don't have any notes" });
    }

    const getNotesPaginated = await noteModel
      .find()
      .sort("-createdAt")
      .limit(3);

    return res.status(201).json({ message: "Done", getNotesPaginated });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", erro: error.message });
  }
};

//&  7. Get a note by its id. (Only the owner of the note can make this operation)

export const getNoteById = async (req, res) => {
  try {
    const { authorization } = req.headers; // user ID
    // // console.log({ headers: req.headers, authorization });

    const { id } = req.params; //note ID

    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded.id);

    const findUser = await noteModel.find({ userId: decoded.id });
    console.log(findUser.length);
    const dataNote = findUser.length;

    if (dataNote == 0) {
      return res.status(400).json({ message: "You are not the owner" });
    }

    const getSingleNote = await noteModel.find({ _id: id });

    if (getSingleNote == 0) {
      return res.status(400).json({ message: "No Note found" });
    } else {
      return res.status(201).json({ message: "Done", getSingleNote });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", erroe: error.message });
  }
};

//!  8 Get a note for logged-in user by its content
//!  9. Retrieves all notes for the logged-in user with user information
//! 10. Using aggregation, retrieves all notes for the logged-in user with user info

//& 11. Delete all notes for the logged-in user. (Get the id for the logged-in user (userId) from the token not the body)
export const deleteAllNote = async (req, res) => {
  try {
    const { authorization } = req.headers; // user ID
    // // console.log({ headers: req.headers, authorization });

    const { noteId } = req.params; //note ID

    // // findOne => Find user by Id in userModel
    const findNote = await noteModel.findById(noteId);
    if (!findNote) {
      return res.status(400).json({ message: "Note not found" });
    }
    console.log(findNote.userId);

    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded.id);

    if (decoded.id != findNote.userId) {
      return res.status(400).json({ message: "You are not the owner" });
    }

    // // 1-deleteOne => to check and return deletedCount
    // const deleteOneResult = await noteModel.deleteOne({ _id: noteId });
    // //check if existed
    // if (!deleteOneResult.deletedCount) {
    //   return res.status(401).json({ message: "note not found" });
    // }

    // 2-findByIdAndDelete => return object has been deleted
    const deleteOneResult = await noteModel.findByIdAndDelete(noteId);
    //check if existed
    if (!deleteOneResult) {
      return res.status(401).json({ message: "note not found" });
    }

    return res
      .status(201)
      .json({ message: "Note is deleted", deleteOneResult });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", erro: error.message });
  }
};

