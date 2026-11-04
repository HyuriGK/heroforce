import { expect, test } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

async function signInAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(adminEmail!);
  await page.getByLabel("Senha", { exact: true }).fill(adminPassword!);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test("administrator signs in and opens a project for editing", async ({
  page,
}) => {
  test.skip(!adminEmail || !adminPassword, "Credenciais E2E não configuradas.");

  await signInAsAdmin(page);
  await expect(
    page.getByRole("heading", { name: "Visão geral" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Editar / }).first(),
  ).toBeVisible();

  await page
    .getByRole("link", { name: /Editar / })
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects\/[^/]+\/edit$/);
  await expect(
    page.getByRole("heading", { name: "Editar projeto" }),
  ).toBeVisible();
  await expect(page.getByLabel("Nome do projeto")).not.toHaveValue("");
});

test("administrator creates and removes a project through the interface", async ({
  page,
}) => {
  test.skip(!adminEmail || !adminPassword, "Credenciais E2E não configuradas.");

  const projectName = `Projeto E2E ${Date.now()}`;
  await signInAsAdmin(page);
  await page.getByRole("link", { name: "Criar projeto" }).click();
  await expect(
    page.getByRole("heading", { name: "Criar projeto" }),
  ).toBeVisible();

  await page.getByLabel("Nome do projeto").fill(projectName);
  const responsibleSelect = page.getByLabel("Herói responsável");
  const heroOption = responsibleSelect
    .locator("option:not([value=''])")
    .first();
  const heroId = await heroOption.getAttribute("value");

  if (!heroId) {
    throw new Error("Nenhum herói disponível para receber o projeto de teste.");
  }

  await responsibleSelect.selectOption(heroId);
  await page
    .getByLabel("Descrição")
    .fill("Projeto temporário criado pelo teste de navegador.");
  await page.getByLabel("Agilidade em percentual").fill("60");
  await page.getByLabel("Encantamento em percentual").fill("70");
  await page.getByLabel("Eficiência em percentual").fill("80");
  await page.getByLabel("Excelência em percentual").fill("90");
  await page.getByLabel("Transparência em percentual").fill("75");
  await page.getByLabel("Ambição em percentual").fill("85");
  await page.getByRole("button", { name: "Criar projeto" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: `Excluir ${projectName}` }).click();
  await expect(
    page.getByRole("heading", { name: projectName }),
  ).not.toBeVisible();
});
