import { test, expect } from '@playwright/test';
import { resetMockData } from "./helpers/cleanup";

//rediger produkt kan opdatere alle felter TODO
//rediger produkt siden viser eksisterende data korrekt TODO
//rediger knap er synlig og virker TODO
//kategori dropdown viser korrekt kategori som valgt TODO
//alle kategorier er tilgængelige i dropdown TODO

test.beforeEach(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
});