import type { Sticker, StickerTeam } from "../types/sticker";

type TeamSeed = {
  slug: string;
  name: string;
  albumCode: string;
  groupLetter: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

export const TEAM_GROUPS: TeamSeed[] = [
  {
    slug: "mexico",
    name: "México",
    albumCode: "MEX",
    groupLetter: "A",
    primaryColor: "#006847",
    secondaryColor: "#ffffff",
    accentColor: "#ce1126",
  },
  {
    slug: "south-africa",
    name: "África do Sul",
    albumCode: "RSA",
    groupLetter: "A",
    primaryColor: "#007749",
    secondaryColor: "#ffb81c",
    accentColor: "#000000",
  },
  {
    slug: "south-korea",
    name: "Coreia do Sul",
    albumCode: "KOR",
    groupLetter: "A",
    primaryColor: "#c60c30",
    secondaryColor: "#ffffff",
    accentColor: "#003478",
  },
  {
    slug: "czechia",
    name: "Tchéquia",
    albumCode: "CZE",
    groupLetter: "A",
    primaryColor: "#d7141a",
    secondaryColor: "#ffffff",
    accentColor: "#11457e",
  },
  {
    slug: "canada",
    name: "Canadá",
    albumCode: "CAN",
    groupLetter: "B",
    primaryColor: "#ff0000",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
  },
  {
    slug: "bosnia-herzegovina",
    name: "Bósnia e Herzegovina",
    albumCode: "BIH",
    groupLetter: "B",
    primaryColor: "#002395",
    secondaryColor: "#fecb00",
    accentColor: "#ffffff",
  },
  {
    slug: "qatar",
    name: "Catar",
    albumCode: "QAT",
    groupLetter: "B",
    primaryColor: "#8a1538",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
  },
  {
    slug: "switzerland",
    name: "Suíça",
    albumCode: "SUI",
    groupLetter: "B",
    primaryColor: "#ff0000",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
  },
  {
    slug: "brazil",
    name: "Brasil",
    albumCode: "BRA",
    groupLetter: "C",
    primaryColor: "#009c3b",
    secondaryColor: "#ffdf00",
    accentColor: "#002776",
  },
  {
    slug: "morocco",
    name: "Marrocos",
    albumCode: "MAR",
    groupLetter: "C",
    primaryColor: "#c1272d",
    secondaryColor: "#006233",
    accentColor: "#ffffff",
  },
  {
    slug: "scotland",
    name: "Escócia",
    albumCode: "SCO",
    groupLetter: "C",
    primaryColor: "#005eb8",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
  },
  {
    slug: "haiti",
    name: "Haiti",
    albumCode: "HAI",
    groupLetter: "C",
    primaryColor: "#00209f",
    secondaryColor: "#d21034",
    accentColor: "#ffffff",
  },
  {
    slug: "usa",
    name: "Estados Unidos",
    albumCode: "USA",
    groupLetter: "D",
    primaryColor: "#3c3b6e",
    secondaryColor: "#ffffff",
    accentColor: "#b22234",
  },
  {
    slug: "paraguay",
    name: "Paraguai",
    albumCode: "PAR",
    groupLetter: "D",
    primaryColor: "#d52b1e",
    secondaryColor: "#ffffff",
    accentColor: "#0038a8",
  },
  {
    slug: "australia",
    name: "Austrália",
    albumCode: "AUS",
    groupLetter: "D",
    primaryColor: "#00843d",
    secondaryColor: "#ffcd00",
    accentColor: "#111111",
  },
  {
    slug: "turkiye",
    name: "Turquia",
    albumCode: "TUR",
    groupLetter: "D",
    primaryColor: "#e30a17",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
  },
  {
    slug: "germany",
    name: "Alemanha",
    albumCode: "GER",
    groupLetter: "E",
    primaryColor: "#000000",
    secondaryColor: "#dd0000",
    accentColor: "#ffce00",
  },
  {
    slug: "curacao",
    name: "Curaçao",
    albumCode: "CUW",
    groupLetter: "E",
    primaryColor: "#002b7f",
    secondaryColor: "#f9e814",
    accentColor: "#ffffff",
  },
  {
    slug: "ivory-coast",
    name: "Costa do Marfim",
    albumCode: "CIV",
    groupLetter: "E",
    primaryColor: "#f77f00",
    secondaryColor: "#ffffff",
    accentColor: "#009e60",
  },
  {
    slug: "ecuador",
    name: "Equador",
    albumCode: "ECU",
    groupLetter: "E",
    primaryColor: "#ffdd00",
    secondaryColor: "#034ea2",
    accentColor: "#ed1c24",
  },
  {
    slug: "netherlands",
    name: "Holanda",
    albumCode: "NED",
    groupLetter: "F",
    primaryColor: "#ff6900",
    secondaryColor: "#ffffff",
    accentColor: "#21468b",
  },
  {
    slug: "japan",
    name: "Japão",
    albumCode: "JPN",
    groupLetter: "F",
    primaryColor: "#bc002d",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
  },
  {
    slug: "sweden",
    name: "Suécia",
    albumCode: "SWE",
    groupLetter: "F",
    primaryColor: "#006aa7",
    secondaryColor: "#fecc00",
    accentColor: "#ffffff",
  },
  {
    slug: "tunisia",
    name: "Tunísia",
    albumCode: "TUN",
    groupLetter: "F",
    primaryColor: "#e70013",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
  },
  {
    slug: "belgium",
    name: "Bélgica",
    albumCode: "BEL",
    groupLetter: "G",
    primaryColor: "#000000",
    secondaryColor: "#fae042",
    accentColor: "#ed2939",
  },
  {
    slug: "iran",
    name: "Irã",
    albumCode: "IRN",
    groupLetter: "G",
    primaryColor: "#239f40",
    secondaryColor: "#ffffff",
    accentColor: "#da0000",
  },
  {
    slug: "egypt",
    name: "Egito",
    albumCode: "EGY",
    groupLetter: "G",
    primaryColor: "#ce1126",
    secondaryColor: "#ffffff",
    accentColor: "#000000",
  },
  {
    slug: "new-zealand",
    name: "Nova Zelândia",
    albumCode: "NZL",
    groupLetter: "G",
    primaryColor: "#00247d",
    secondaryColor: "#ffffff",
    accentColor: "#cc142b",
  },
  {
    slug: "spain",
    name: "Espanha",
    albumCode: "ESP",
    groupLetter: "H",
    primaryColor: "#aa151b",
    secondaryColor: "#f1bf00",
    accentColor: "#111111",
  },
  {
    slug: "uruguay",
    name: "Uruguai",
    albumCode: "URU",
    groupLetter: "H",
    primaryColor: "#0038a8",
    secondaryColor: "#ffffff",
    accentColor: "#fcd116",
  },
  {
    slug: "saudi-arabia",
    name: "Arábia Saudita",
    albumCode: "KSA",
    groupLetter: "H",
    primaryColor: "#006c35",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
  },
  {
    slug: "cape-verde",
    name: "Cabo Verde",
    albumCode: "CPV",
    groupLetter: "H",
    primaryColor: "#003893",
    secondaryColor: "#ffffff",
    accentColor: "#cf2027",
  },
  {
    slug: "france",
    name: "França",
    albumCode: "FRA",
    groupLetter: "I",
    primaryColor: "#002654",
    secondaryColor: "#ffffff",
    accentColor: "#ed2939",
  },
  {
    slug: "senegal",
    name: "Senegal",
    albumCode: "SEN",
    groupLetter: "I",
    primaryColor: "#00853f",
    secondaryColor: "#fdef42",
    accentColor: "#e31b23",
  },
  {
    slug: "iraq",
    name: "Iraque",
    albumCode: "IRQ",
    groupLetter: "I",
    primaryColor: "#ce1126",
    secondaryColor: "#ffffff",
    accentColor: "#000000",
  },
  {
    slug: "norway",
    name: "Noruega",
    albumCode: "NOR",
    groupLetter: "I",
    primaryColor: "#ba0c2f",
    secondaryColor: "#ffffff",
    accentColor: "#00205b",
  },
  {
    slug: "argentina",
    name: "Argentina",
    albumCode: "ARG",
    groupLetter: "J",
    primaryColor: "#75aadb",
    secondaryColor: "#ffffff",
    accentColor: "#fcbf49",
  },
  {
    slug: "algeria",
    name: "Argélia",
    albumCode: "ALG",
    groupLetter: "J",
    primaryColor: "#006233",
    secondaryColor: "#ffffff",
    accentColor: "#d21034",
  },
  {
    slug: "austria",
    name: "Áustria",
    albumCode: "AUT",
    groupLetter: "J",
    primaryColor: "#ed2939",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
  },
  {
    slug: "jordan",
    name: "Jordânia",
    albumCode: "JOR",
    groupLetter: "J",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#007a3d",
  },
  {
    slug: "portugal",
    name: "Portugal",
    albumCode: "POR",
    groupLetter: "K",
    primaryColor: "#006600",
    secondaryColor: "#ff0000",
    accentColor: "#ffcc00",
  },
  {
    slug: "congo-dr",
    name: "RD Congo",
    albumCode: "COD",
    groupLetter: "K",
    primaryColor: "#007fff",
    secondaryColor: "#f7d618",
    accentColor: "#ce1021",
  },
  {
    slug: "uzbekistan",
    name: "Uzbequistão",
    albumCode: "UZB",
    groupLetter: "K",
    primaryColor: "#0099b5",
    secondaryColor: "#ffffff",
    accentColor: "#1eb53a",
  },
  {
    slug: "colombia",
    name: "Colômbia",
    albumCode: "COL",
    groupLetter: "K",
    primaryColor: "#fcd116",
    secondaryColor: "#003893",
    accentColor: "#ce1126",
  },
  {
    slug: "england",
    name: "Inglaterra",
    albumCode: "ENG",
    groupLetter: "L",
    primaryColor: "#ffffff",
    secondaryColor: "#ce1124",
    accentColor: "#00247d",
  },
  {
    slug: "croatia",
    name: "Croácia",
    albumCode: "CRO",
    groupLetter: "L",
    primaryColor: "#ff0000",
    secondaryColor: "#ffffff",
    accentColor: "#171796",
  },
  {
    slug: "ghana",
    name: "Gana",
    albumCode: "GHA",
    groupLetter: "L",
    primaryColor: "#ce1126",
    secondaryColor: "#fcd116",
    accentColor: "#006b3f",
  },
  {
    slug: "panama",
    name: "Panamá",
    albumCode: "PAN",
    groupLetter: "L",
    primaryColor: "#005293",
    secondaryColor: "#ffffff",
    accentColor: "#d21034",
  },
];

export const TOTAL_STICKERS = 995;

export const stickers: Sticker[] = [
  createPaniniLogoSticker(),
  ...createIntroStickers(),
  ...createTeamStickers(),
  ...createCocaColaStickers(),
];

function createPaniniLogoSticker(): Sticker {
  return {
    id: 995,
    code: "PAN-000",
    number: 995,
    albumCode: "00",
    groupCode: "PAN",
    numberInGroup: 0,
    displayCode: "00",
    playerName: null,
    playerPosition: null,
    isSpecial: true,
    specialFinish: "Especial",
    countsForCompletion: true,
    section: "Logo Panini",
    pageNumber: null,
    displayOrder: 0,
    team: null,
    group: {
      id: 49,
      code: "PAN",
      name: "Logo Panini",
      type: "intro",
      displayOrder: 0,
    },
    type: {
      id: 6,
      slug: "special",
      name: "Especial",
      isSpecial: true,
    },
  };
}

function createIntroStickers(): Sticker[] {
  return Array.from({ length: 20 }, (_, index) => {
    const numberInGroup = index + 1;
    const id = numberInGroup;
    const albumCode = createAlbumCode("FWC", numberInGroup);

    return {
      id,
      code: albumCode,
      number: id,
      albumCode,
      groupCode: "FWC",
      numberInGroup,
      displayCode: `FWC ${numberInGroup}`,
      playerName: null,
      playerPosition: null,
      isSpecial: true,
      specialFinish: "Especial",
      countsForCompletion: true,
      section: numberInGroup <= 9 ? "Introdução" : "FIFA Museum",
      pageNumber: null,
      displayOrder: id,
      team: null,
      group: {
        id: 1,
        code: "FWC",
        name: "Introdução e FIFA Museum",
        type: "intro",
        displayOrder: 1,
      },
      type: {
        id: numberInGroup <= 9 ? 4 : 5,
        slug: numberInGroup <= 9 ? "introduction" : "museum",
        name: numberInGroup <= 9 ? "Introdução" : "FIFA Museum",
        isSpecial: true,
      },
    };
  });
}

function createTeamStickers(): Sticker[] {
  return TEAM_GROUPS.flatMap((team, teamIndex) => {
    return Array.from({ length: 20 }, (_, index) => {
      const numberInGroup = index + 1;
      const id = 20 + teamIndex * 20 + numberInGroup;
      const albumCode = createAlbumCode(team.albumCode, numberInGroup);
      const stickerType = getTeamStickerType(numberInGroup);

      return {
        id,
        code: albumCode,
        number: id,
        albumCode,
        groupCode: team.albumCode,
        numberInGroup,
        displayCode: `${team.albumCode} ${numberInGroup}`,
        playerName: null,
        playerPosition: null,
        isSpecial: numberInGroup === 1,
        specialFinish: numberInGroup === 1 ? "Especial" : null,
        countsForCompletion: true,
        section: team.name,
        pageNumber: null,
        displayOrder: id,
        team: createTeam(teamIndex + 1, team),
        group: {
          id: teamIndex + 2,
          code: team.albumCode,
          name: team.name,
          type: "team",
          displayOrder: teamIndex + 2,
        },
        type: stickerType,
      };
    });
  });
}

function createCocaColaStickers(): Sticker[] {
  return Array.from({ length: 14 }, (_, index) => {
    const numberInGroup = index + 1;
    const id = 980 + numberInGroup;
    const albumCode = `CC${numberInGroup}`;

    return {
      id,
      code: `CC-${numberInGroup.toString().padStart(3, "0")}`,
      number: id,
      albumCode,
      groupCode: "CC",
      numberInGroup,
      displayCode: albumCode,
      playerName: null,
      playerPosition: null,
      isSpecial: false,
      specialFinish: null,
      countsForCompletion: false,
      section: "Coca-Cola",
      pageNumber: null,
      displayOrder: id,
      team: null,
      group: {
        id: 50,
        code: "CC",
        name: "Coca-Cola",
        type: "extra",
        displayOrder: 50,
      },
      type: {
        id: 8,
        slug: "partner_extra",
        name: "Extra promocional",
        isSpecial: false,
      },
    };
  });
}

function createAlbumCode(groupCode: string, numberInGroup: number): string {
  return `${groupCode}-${numberInGroup.toString().padStart(3, "0")}`;
}

function createTeam(id: number, team: TeamSeed): StickerTeam {
  return {
    id,
    slug: team.slug,
    name: team.name,
    countryCode: null,
    fifaCode: team.albumCode,
    albumCode: team.albumCode,
    groupLetter: team.groupLetter,
    primaryColor: team.primaryColor,
    secondaryColor: team.secondaryColor,
    accentColor: team.accentColor,
  };
}

function getTeamStickerType(numberInGroup: number) {
  if (numberInGroup === 1) {
    return {
      id: 2,
      slug: "team_crest",
      name: "Escudo da seleção",
      isSpecial: true,
    };
  }

  if (numberInGroup === 2) {
    return {
      id: 3,
      slug: "team_photo",
      name: "Seleção completa",
      isSpecial: false,
    };
  }

  return {
    id: 1,
    slug: "player",
    name: "Jogador",
    isSpecial: false,
  };
}
