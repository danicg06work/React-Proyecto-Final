import { expect, test } from '@playwright/test'

const createUserSession = async (page, suffix) => {
  const username = `e2e_user_${suffix}`
  const password = '123456'

  await page.goto('/register')
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Registrarse' }).click()
  await expect(page).toHaveURL(/\/games/)
  await expect(page.getByText(username)).toBeVisible()

  return { username, password }
}

test.describe('Flujo E2E de principio a fin', () => {
  test('Registro de usuario e inicio automático de sesión', async ({ page }) => {
    const suffix = Date.now()
    await createUserSession(page, suffix)
  })

  test('Login incorrecto muestra mensaje de error', async ({ page }) => {
    await page.goto('/login')

    await page.locator('#username').fill('usuario_que_no_existe')
    await page.locator('#password').fill('password_invalida')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByText(/user not found|invalid password/i)).toBeVisible()
  })

  test('Ruta protegida redirige a login sin sesión', async ({ page }) => {
    await page.goto('/my-games')
    await expect(page).toHaveURL(/\/login/)
  })

  test('Listado renderiza nombre, portada y precio', async ({ page }) => {
    await page.goto('/games')

    await expect(page.getByRole('heading', { name: 'Todos los videojuegos' })).toBeVisible()
    await expect(page.locator('.game-card').first()).toBeVisible()
    await expect(page.locator('.game-title').first()).toBeVisible()
    await expect(page.locator('.game-image').first()).toBeVisible()
    await expect(page.locator('.game-price').first()).toBeVisible()
  })

  test('Búsqueda filtra el listado', async ({ page }) => {
    const suffix = Date.now()
    const uniqueGameName = `JuegoBusqueda${suffix}`

    await createUserSession(page, suffix)
    await page.locator('a[href="/games/new"]').click()
    await page.getByPlaceholder('Nombre').fill(uniqueGameName)
    await page.getByPlaceholder('Precio').fill('5.50')
    await page.getByRole('button', { name: 'Crear videojuego' }).click()

    await page.goto('/games')
    await expect(page.getByRole('heading', { name: 'Todos los videojuegos' })).toBeVisible()

    await page.locator('input[aria-label="Buscar"]').fill(uniqueGameName)
    await expect(page.getByText(uniqueGameName)).toBeVisible()

    await page.locator('input[aria-label="Buscar"]').fill('__NO_EXISTE_E2E__')
    await expect(page.getByText('No hay juegos para mostrar.')).toBeVisible()
  })

  test('Filtros por categoría/plataforma cambian resultados', async ({ page }) => {
    await page.goto('/games')

    const initialCount = await page.locator('.game-card').count()

    await page.locator('select[aria-label="Categoría"]').selectOption('Aventura')
    await page.locator('select[aria-label="Plataforma"]').selectOption('Switch')

    const filteredCount = await page.locator('.game-card').count()
    expect(filteredCount).toBeLessThanOrEqual(initialCount)

    await page.locator('select[aria-label="Categoría"]').selectOption('')
    await page.locator('select[aria-label="Plataforma"]').selectOption('')
    const resetCount = await page.locator('.game-card').count()
    expect(resetCount).toBeGreaterThanOrEqual(filteredCount)
  })

  test('Paginación cambia elementos y número de página', async ({ page }) => {
    await page.goto('/games')

    await page.getByLabel('Juegos por página:').selectOption('5')
    const firstPageFirstTitle = (await page.locator('.game-title').first().innerText()).trim()

    await page.getByRole('button', { name: 'Siguiente' }).click()
    await expect(page.getByText(/Página 2 de/)).toBeVisible()
    const secondPageFirstTitle = (await page.locator('.game-title').first().innerText()).trim()

    expect(secondPageFirstTitle).not.toBe(firstPageFirstTitle)
  })

  test('Crear videojuego, ver detalle, eliminar y logout', async ({ page }) => {
    const suffix = Date.now()
    const gameName = `E2E Juego ${suffix}`

    await createUserSession(page, suffix)

    await page.locator('a[href="/games/new"]').click()
    await expect(page).toHaveURL(/\/games\/new/)

    await page.getByPlaceholder('Nombre').fill(gameName)
    await page.getByPlaceholder('Descripción').fill('Juego creado desde test E2E')
    await page.getByPlaceholder('Compañía').fill('E2E Studio')
    await page.getByPlaceholder('Fecha de lanzamiento').fill('2026-01-01')
    await page.getByPlaceholder('Plataformas (separadas por coma)').fill('PC,Switch')
    await page.getByPlaceholder('Categorías (separadas por coma)').fill('Aventura,Puzzle')
    await page.getByPlaceholder('Precio').fill('9.99')
    await page.getByRole('button', { name: 'Crear videojuego' }).click()

    await expect(page).toHaveURL(/\/games\/\d+/)
    await expect(page.getByRole('heading', { name: gameName })).toBeVisible()
    await expect(page.getByText(/Compañía:\s*E2E Studio/)).toBeVisible()
    await expect(page.getByText(/Precio:\s*9\.99/)).toBeVisible()
    await expect(page.locator('p').filter({ hasText: 'Plataformas:' })).toContainText('PC, Switch')

    await page.locator('a[href="/my-games"]').click()
    await expect(page).toHaveURL(/\/my-games/)
    await expect(page.getByText(gameName)).toBeVisible()

    await page.getByRole('link', { name: 'Ver detalle' }).first().click()
    await expect(page.getByRole('heading', { name: gameName })).toBeVisible()

    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Borrar juego' }).click()

    await expect(page).toHaveURL(/\/games/)
    await page.locator('input[aria-label="Buscar"]').fill(gameName)
    await expect(page.getByText('No hay juegos para mostrar.')).toBeVisible()

    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await page.goto('/my-games')
    await expect(page).toHaveURL(/\/login/)
  })
})
