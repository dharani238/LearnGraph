import Concept from "../models/Concept";

interface ConceptScore {
  conceptId: string;
  conceptName: string;
  score: number;
}

interface RootGapResult {
  id: string;
  name: string;
  description: string;
}

export async function findRootGap(
  conceptScores: ConceptScore[]
): Promise<RootGapResult | null> {
  if (!conceptScores.length) {
    return null;
  }

  /*
   * A concept is considered weak when
   * its score is below 60%.
   */
  const weakConcepts =
    conceptScores.filter(
      (concept) => concept.score < 60
    );

  if (!weakConcepts.length) {
    return null;
  }

  /*
   * Start with the weakest concept.
   */
  const weakest =
    [...weakConcepts].sort(
      (a, b) => a.score - b.score
    )[0];

  let current =
    await Concept.findById(
      weakest.conceptId
    ).populate(
      "prerequisites",
      "name description prerequisites"
    );

  if (!current) {
    return null;
  }

  /*
   * Keep moving backward through prerequisites.
   */
  const visited = new Set<string>();

  while (current) {
    const currentId =
      current._id.toString();

    if (visited.has(currentId)) {
      break;
    }

    visited.add(currentId);

    const prerequisites =
      current.prerequisites as any[];

    if (
      !prerequisites ||
      prerequisites.length === 0
    ) {
      break;
    }

    /*
     * Find a weak prerequisite.
     */
    const weakPrerequisite =
      prerequisites.find(
        (prerequisite) => {
          const score =
            conceptScores.find(
              (item) =>
                item.conceptId ===
                prerequisite._id.toString()
            );

          return (
            score &&
            score.score < 60
          );
        }
      );

    if (!weakPrerequisite) {
      break;
    }

    const next =
      await Concept.findById(
        weakPrerequisite._id
      ).populate(
        "prerequisites",
        "name description prerequisites"
      );

    if (!next) {
      break;
    }

    current = next;
  }

  return {
    id: current._id.toString(),
    name: current.name,
    description: current.description,
  };
}