

import { I18nextProvider } from "react-i18next";
import {
  initReactI18next,
} from "react-i18next";

import { render as rtlRender, RenderOptions, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainViewTranslate from "../MainViewTranslate";
import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import React from "react";

const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
    },
  },
  pt: {
    translation: {
      "Welcome to React": "Bem vindo ao React e ao react-i18next",
    },
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    resources: {
      en: resources.en,
      pt: resources.pt,
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

function render(ui: JSX.Element, options?: RenderOptions) {
  function Wrapper({ children }: {children: React.ReactChild }) {
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
  }
  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...options }),
  };
}

test("it should test lang", () => {
  render(<MainViewTranslate useSuspense={false} />);
  const heading = screen.getByRole("heading");
  const pt = screen.getByText("pt");
  const en = screen.getByText("en");

  expect(heading).toHaveTextContent("Welcome to React and react-i18next");
  userEvent.click(pt);
  expect(heading).toHaveTextContent("Bem vindo ao React e ao react-i18next");
  userEvent.click(en);
  expect(heading).toHaveTextContent("Welcome to React and react-i18next");
});
