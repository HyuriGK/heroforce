import { describe, expect, it } from "vitest";

import { calculateProgress, statusLabels } from "./project";

describe("project utilities", () => {
  it("calculates rounded progress from the six HeroForce goals", () => {
    expect(
      calculateProgress({
        agility: 80,
        enchantment: 60,
        efficiency: 70,
        excellence: 90,
        transparency: 40,
        ambition: 60,
      }),
    ).toBe(67);
  });

  it("keeps all API statuses available for the interface", () => {
    expect(statusLabels.em_andamento).toBe("Em andamento");
    expect(statusLabels.pendente).toBe("Pendente");
    expect(statusLabels.concluido).toBe("Concluído");
  });
});
