// TODO: replace bracketed placeholders before launch. Facts from Joko's CV.
export const site = {
  name: "Joko",
  fullName: "Joko Ymmanuel Comia",
  // The name as the brand sets it beside the JC mark.
  brandName: "Joko Comia",
  location: "San Pablo City, Laguna",
  role: "UI/UX designer and design engineer",
  roles: ["UI/UX designer", "Design engineer"],
  statement: "A designer who builds what he designs.",
  intro:
    "I design interfaces and build them in code, with as much care for the code structure as for how it looks.",
  // 1200 × 1600 portrait (3:4), cropped from the studio photo; next/image serves smaller sizes.
  photo: "/joko.webp",
  email: "jokocomia103@gmail.com",
  // One-page CV PDF; replace the file to update it.
  cv: "/joko-comia-cv.pdf",
  // Credly username: public badges are listed on Certificates automatically (refreshed daily).
  credly: "joko-ymmanuel-comia",
  links: {
    github: "https://github.com/Joko2005",
    linkedin: "https://www.linkedin.com/in/joko-comia",
  },
} as const;
