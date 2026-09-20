import mongoose from "mongoose";
import dotenv from "dotenv";

import Subject from "../models/Subject";
import Topic from "../models/Topic";
import Concept from "../models/Concept";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is missing from .env");
}

type ConceptSeed = {
  name: string;
  description: string;
};

type TopicSeed = {
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  concepts: ConceptSeed[];
};

type SubjectSeed = {
  name: string;
  description: string;
  icon: string;
  topics: TopicSeed[];
};

const subjects: SubjectSeed[] = [
  {
    name: "Computer Science",
    description:
      "Programming, algorithms, data structures and computational concepts.",
    icon: "💻",

    topics: [
      {
        name: "Recursion",
        description:
          "Understanding functions that solve problems by calling themselves.",
        difficulty: "Intermediate",

        concepts: [
          {
            name: "Functions",
            description:
              "Reusable blocks of code that perform a specific task.",
          },
          {
            name: "Call Stack",
            description:
              "The runtime structure that tracks active function calls.",
          },
          {
            name: "Recursion",
            description:
              "A technique where a function solves a problem by calling itself on a smaller case.",
          },
        ],
      },

      {
        name: "Data Structures",
        description:
          "Methods for organizing and managing data efficiently.",
        difficulty: "Intermediate",

        concepts: [
          {
            name: "Arrays",
            description:
              "A collection of elements stored in contiguous memory locations.",
          },
          {
            name: "Linked Lists",
            description:
              "A sequence of nodes where each node points to another node.",
          },
          {
            name: "Stacks and Queues",
            description:
              "Linear data structures used for ordered insertion and removal.",
          },
        ],
      },

      {
        name: "Algorithms",
        description:
          "Step-by-step procedures for solving computational problems.",
        difficulty: "Intermediate",

        concepts: [
          {
            name: "Algorithm Basics",
            description:
              "Fundamental ideas behind designing step-by-step solutions.",
          },
          {
            name: "Searching",
            description:
              "Techniques for finding an element within a collection.",
          },
          {
            name: "Sorting",
            description:
              "Techniques for arranging elements according to a defined order.",
          },
        ],
      },
    ],
  },

  {
    name: "Mathematics",
    description:
      "Core mathematical concepts including calculus, algebra and probability.",
    icon: "📐",

    topics: [
      {
        name: "Calculus",
        description:
          "Study of change, limits, derivatives and integrals.",
        difficulty: "Intermediate",

        concepts: [
          {
            name: "Functions",
            description:
              "Relationships that map input values to output values.",
          },
          {
            name: "Limits",
            description:
              "The value a function approaches as its input approaches a particular value.",
          },
          {
            name: "Derivatives",
            description:
              "A measure of how a function changes with respect to its input.",
          },
        ],
      },

      {
        name: "Linear Algebra",
        description:
          "Study of vectors, matrices and systems of linear equations.",
        difficulty: "Intermediate",

        concepts: [
          {
            name: "Vectors",
            description:
              "Mathematical objects representing magnitude and direction.",
          },
          {
            name: "Matrices",
            description:
              "Rectangular arrangements of numbers used to represent data and transformations.",
          },
          {
            name: "Linear Equations",
            description:
              "Equations where variables occur only to the first power.",
          },
        ],
      },

      {
        name: "Probability",
        description:
          "Study of uncertainty and the likelihood of events.",
        difficulty: "Beginner",

        concepts: [
          {
            name: "Sample Space",
            description:
              "The complete set of possible outcomes of an experiment.",
          },
          {
            name: "Events",
            description:
              "Sets of outcomes from a probability experiment.",
          },
          {
            name: "Conditional Probability",
            description:
              "The probability of an event occurring given that another event has occurred.",
          },
        ],
      },
    ],
  },

  {
    name: "Physics",
    description:
      "Fundamental principles describing matter, motion, energy and forces.",
    icon: "⚛️",

    topics: [
      {
        name: "Mechanics",
        description:
          "Study of motion, forces and interactions between objects.",
        difficulty: "Intermediate",

        concepts: [
          {
            name: "Motion",
            description:
              "Change in position of an object over time.",
          },
          {
            name: "Force",
            description:
              "An interaction that can change the motion of an object.",
          },
          {
            name: "Newton's Laws",
            description:
              "Three fundamental laws describing the relationship between force and motion.",
          },
        ],
      },

      {
        name: "Thermodynamics",
        description:
          "Study of heat, energy and their transformations.",
        difficulty: "Intermediate",

        concepts: [
          {
            name: "Temperature",
            description:
              "A measure related to the thermal state of a system.",
          },
          {
            name: "Heat",
            description:
              "Energy transferred between systems because of a temperature difference.",
          },
          {
            name: "First Law of Thermodynamics",
            description:
              "The principle of conservation of energy applied to thermodynamic systems.",
          },
        ],
      },

      {
        name: "Electromagnetism",
        description:
          "Study of electric charges, fields, currents and magnetic effects.",
        difficulty: "Advanced",

        concepts: [
          {
            name: "Electric Charge",
            description:
              "A physical property responsible for electric interactions.",
          },
          {
            name: "Electric Field",
            description:
              "A region around a charge where another charge experiences an electric force.",
          },
          {
            name: "Magnetic Field",
            description:
              "A region where moving charges and magnetic materials experience magnetic effects.",
          },
        ],
      },
    ],
  },

  {
    name: "Chemistry",
    description:
      "Study of matter, atoms, molecules and chemical transformations.",
    icon: "🧪",

    topics: [
      {
        name: "Atomic Structure",
        description:
          "Study of atoms, subatomic particles and electron arrangement.",
        difficulty: "Beginner",

        concepts: [
          {
            name: "Atoms",
            description:
              "The basic units of chemical elements.",
          },
          {
            name: "Subatomic Particles",
            description:
              "Protons, neutrons and electrons that make up atoms.",
          },
          {
            name: "Electron Configuration",
            description:
              "The arrangement of electrons around an atomic nucleus.",
          },
        ],
      },

      {
        name: "Chemical Bonding",
        description:
          "Study of how atoms combine to form molecules and compounds.",
        difficulty: "Intermediate",

        concepts: [
          {
            name: "Valence Electrons",
            description:
              "Electrons in the outermost shell of an atom.",
          },
          {
            name: "Ionic Bonds",
            description:
              "Chemical bonds formed through electrostatic attraction between oppositely charged ions.",
          },
          {
            name: "Covalent Bonds",
            description:
              "Chemical bonds formed by sharing electrons between atoms.",
          },
        ],
      },

      {
        name: "Chemical Reactions",
        description:
          "Study of how substances transform into new substances.",
        difficulty: "Intermediate",

        concepts: [
          {
            name: "Reactants and Products",
            description:
              "Substances that participate in and result from a chemical reaction.",
          },
          {
            name: "Balancing Equations",
            description:
              "Ensuring the same number of atoms of each element appear on both sides of a reaction.",
          },
          {
            name: "Reaction Types",
            description:
              "Common patterns such as synthesis, decomposition and replacement reactions.",
          },
        ],
      },
    ],
  },

  {
    name: "Statistics",
    description:
      "Methods for collecting, analyzing and interpreting data.",
    icon: "📊",

    topics: [
      {
        name: "Probability",
        description:
          "Mathematical study of uncertainty and random events.",
        difficulty: "Beginner",

        concepts: [
          {
            name: "Random Experiments",
            description:
              "Processes whose outcomes cannot be predicted with certainty.",
          },
          {
            name: "Probability Rules",
            description:
              "Basic principles used to calculate probabilities of events.",
          },
          {
            name: "Random Variables",
            description:
              "Variables whose values depend on the outcome of a random experiment.",
          },
        ],
      },

      {
        name: "Descriptive Statistics",
        description:
          "Methods for summarizing and describing datasets.",
        difficulty: "Beginner",

        concepts: [
          {
            name: "Mean",
            description:
              "The arithmetic average of a collection of values.",
          },
          {
            name: "Median",
            description:
              "The middle value when observations are ordered.",
          },
          {
            name: "Standard Deviation",
            description:
              "A measure of how spread out values are around the mean.",
          },
        ],
      },

      {
        name: "Hypothesis Testing",
        description:
          "Statistical methods for evaluating claims using sample data.",
        difficulty: "Advanced",

        concepts: [
          {
            name: "Null Hypothesis",
            description:
              "A statement representing the default assumption tested using sample evidence.",
          },
          {
            name: "P-Value",
            description:
              "A probability used to measure evidence against the null hypothesis.",
          },
          {
            name: "Significance Level",
            description:
              "A threshold used to determine whether statistical evidence is considered significant.",
          },
        ],
      },
    ],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI!);

    console.log("Connected to MongoDB");

    for (const subjectData of subjects) {
      let subject = await Subject.findOne({
        name: subjectData.name,
      });

      if (!subject) {
        subject = await Subject.create({
          name: subjectData.name,
          description: subjectData.description,
          icon: subjectData.icon,
        });

        console.log(`Created subject: ${subjectData.name}`);
      } else {
        console.log(`Subject exists: ${subjectData.name}`);
      }

      for (const topicData of subjectData.topics) {
        let topic = await Topic.findOne({
          subjectId: subject._id,
          name: topicData.name,
        });

        if (!topic) {
          topic = await Topic.create({
            subjectId: subject._id,
            name: topicData.name,
            description: topicData.description,
            difficulty: topicData.difficulty,
          });

          console.log(
            `  Created topic: ${subjectData.name} → ${topicData.name}`
          );
        } else {
          console.log(
            `  Topic exists: ${subjectData.name} → ${topicData.name}`
          );
        }

        const existingConcepts = await Concept.find({
          topicId: topic._id,
        }).sort({ order: 1 });

        if (existingConcepts.length === 0) {
          let previousConcept: any = null;

          for (
            let i = 0;
            i < topicData.concepts.length;
            i++
          ) {
            const conceptData = topicData.concepts[i];

            const prerequisites: any[] = previousConcept
              ? [
                {
                  _id: previousConcept._id,
                  name: previousConcept.name,
                },
              ]
              : [];

            const concept = await Concept.create({
              topicId: topic._id,
              name: conceptData.name,
              description: conceptData.description,
              order: i + 1,
              prerequisites,
            });

            previousConcept = concept;
          }

          console.log(
            `    Added ${topicData.concepts.length} concepts`
          );
        }
      }
    }

    console.log("\n================================");
    console.log("Multi-topic seed completed!");
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedDatabase();