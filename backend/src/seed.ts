import dotenv from "dotenv";
import mongoose from "mongoose";

import Subject from "./models/Subject";
import Topic from "./models/Topic";
import Concept from "./models/Concept";
import Question from "./models/Question";

dotenv.config();

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // --------------------------------------------------
    // 1. Clear existing LearnGraph seed data
    // --------------------------------------------------

    await Question.deleteMany({});
    await Concept.deleteMany({});
    await Topic.deleteMany({});
    await Subject.deleteMany({});

    console.log("Old data cleared");

    // --------------------------------------------------
    // 2. Create Subject
    // --------------------------------------------------

    const subject = await Subject.create({
      name: "Computer Science",
      description:
        "Learn fundamental programming and computer science concepts.",
      icon: "💻",
    });

    // --------------------------------------------------
    // 3. Create Topic
    // --------------------------------------------------

    const topic = await Topic.create({
      subjectId: subject._id,
      name: "Recursion",
      description:
        "Understand functions, the call stack, and recursive problem solving.",
      difficulty: "Intermediate",
    });

    // --------------------------------------------------
    // 4. Create Concepts
    // --------------------------------------------------

    const functions = await Concept.create({
      topicId: topic._id,
      name: "Functions",
      description:
        "A function is a reusable block of code that performs a specific task.",
      prerequisites: [],
      order: 1,
    });

    const callStack = await Concept.create({
      topicId: topic._id,
      name: "Call Stack",
      description:
        "The call stack keeps track of active function calls during program execution.",
      prerequisites: [functions._id],
      order: 2,
    });

    const recursion = await Concept.create({
      topicId: topic._id,
      name: "Recursion",
      description:
        "Recursion is a technique where a function calls itself to solve a smaller version of a problem.",
      prerequisites: [callStack._id],
      order: 3,
    });

    console.log("Concepts created");

    // --------------------------------------------------
    // 5. Create Questions
    // --------------------------------------------------

    await Question.create([
      {
        conceptId: functions._id,
        question: "What is the main purpose of a function?",
        options: [
          "To store only numbers",
          "To group reusable instructions",
          "To create a database",
          "To stop program execution",
        ],
        correctAnswer: 1,
        difficulty: "Beginner",
      },

      {
        conceptId: functions._id,
        question:
          "Which part of a function specifies the values it can receive?",
        options: [
          "Parameters",
          "Return statement",
          "Loop",
          "Comment",
        ],
        correctAnswer: 0,
        difficulty: "Beginner",
      },

      {
        conceptId: callStack._id,
        question: "What does the call stack primarily keep track of?",
        options: [
          "Database records",
          "Active function calls",
          "HTML elements",
          "Network connections",
        ],
        correctAnswer: 1,
        difficulty: "Beginner",
      },

      {
        conceptId: callStack._id,
        question: "What generally happens when a function finishes executing?",
        options: [
          "It is removed from the call stack",
          "It stays permanently on the stack",
          "The entire program restarts",
          "A new database is created",
        ],
        correctAnswer: 0,
        difficulty: "Intermediate",
      },

      {
        conceptId: recursion._id,
        question: "What is recursion?",
        options: [
          "A function calling itself",
          "A database query",
          "A type of variable",
          "A sorting algorithm only",
        ],
        correctAnswer: 0,
        difficulty: "Beginner",
      },

      {
        conceptId: recursion._id,
        question:
          "What prevents a recursive function from continuing indefinitely?",
        options: [
          "A database",
          "A base case",
          "A CSS rule",
          "A loop counter only",
        ],
        correctAnswer: 1,
        difficulty: "Intermediate",
      },
    ]);

    console.log("Questions created");

    console.log("\n=================================");
    console.log("LearnGraph database seeded!");
    console.log("=================================\n");

    console.log("Subject:", subject.name);
    console.log("Topic:", topic.name);
    console.log("Concepts:");
    console.log("1. Functions");
    console.log("2. Call Stack → Functions");
    console.log("3. Recursion → Call Stack");

    await mongoose.disconnect();

    console.log("\nMongoDB connection closed");
  } catch (error) {
    console.error("Seed failed:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

seedDatabase();