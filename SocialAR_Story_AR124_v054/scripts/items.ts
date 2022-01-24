export interface VendingItem {
    name: string;
    fg: string;
    bg: string;
    shadow: string;
    icon: string;
    slot: number;
    used: boolean;
}

export { items }

var items:VendingItem[] = [
    { 
      name: "Head Camera",
      fg: "A06_HeadCamera",
      bg: "",
      shadow: "",
      icon: "A06_HeadCamera",
      slot: 0,
      used: false
    },
    { 
      name: "Unicorn Horn",
      fg: "A07_UnicornHornHair",
      bg: "",
      shadow: "",
      icon: "A07_UnicornHornHair",
      slot: 0,
      used: false
    },
    { 
      name: "Headphones",
      fg: "A08_Headphones_Sn_FG",
      bg: "A08_Headphones_Sn_BG",
      shadow: "A08_Headphones_SHDW",
      icon: "A08_Headphones",
      slot: 0,
      used: false
    },
    { 
      name: "Rainbow Wig",
      fg: "A09_RainbowWig_Sn_FG",
      bg: "A09_RainbowWig_Sn_BG",
      shadow: "",
      icon: "A09_RainbowWig",
      slot: 0,
      used: false
    },
    { 
      name: "Cowboy Hat",
      fg: "A10_CowboyHat_Sn",
      bg: "",
      shadow: "",
      icon: "A10_CowboyHat",
      slot: 0,
      used: false
    },
    { 
      name: "Top Hat",
      fg: "A11_TopHat_Sn_FG",
      bg: "A11_TopHat_Sn",
      shadow: "",
      icon: "A11_TopHat",
      slot: 0,
      used: false
    },
    { 
      name: "Flame Tiara",
      fg: "A12_FlameTiara_Sn",
      bg: "",
      shadow: "A12_FlameTiara_Sn_SHDW",
      icon: "A12_FlameTiara_Sn",
      slot: 0,
      used: false
    },
    { 
      name: "Tropical Tiara",
      fg: "A13_TropicalTiara_Sn",
      bg: "",
      shadow: "A13_TropicalTiara_SN_SHDW",
      icon: "A13_TropicalTiara",
      slot: 0,
      used: false
    },
    { 
      name: "Carrot Nose",
      fg: "A14_CarrotNose",
      bg: "",
      shadow: "",
      icon: "A14_CarrotNose",
      slot: 2,
      used: false
    },
    { 
      name: "3D Glasses",
      fg: "A15_3dGlasses_Sn",
      bg: "",
      shadow: "",
      icon: "A15_3dGlasses",
      slot: 1,
      used: false
    },
    { 
      name: "Money Glasses",
      fg: "A17_MoneyGlasses_Sn",
      bg: "",
      shadow: "",
      icon: "A17_MoneyGlasses",
      slot: 1,
      used: false
    },
    { 
      name: "Love U Glasses",
      fg: "A18_Love-U-Glasses_Sn",
      bg: "",
      shadow: "",
      icon: "A18_Love-U-Glasses_Sn",
      slot: 1,
      used: false
    },
    { 
      name: "Monocle",
      fg: "A19_Monocle_Sn",
      bg: "",
      shadow: "",
      icon: "A19_Monocle",
      slot: 1,
      used: false
    },
    { 
      name: "Steampunk",
      fg: "A20_Steampunk_Sn",
      bg: "",
      shadow: "",
      icon: "A20_Steampunk",
      slot: 1,
      used: false
    },
    { 
      name: "Fruit Facial",
      fg: "A21_FruitFacial",
      bg: "",
      shadow: "",
      icon: "A21_FruitFacial",
      slot: 1,
      used: false
    },
    { 
      name: "Horns Beard",
      fg: "A22_HornsBeard",
      bg: "",
      shadow: "",
      icon: "A22_HornsBeard",
      slot: 2,
      used: false
    },
    { 
      name: "Mustache",
      fg: "A23_Mustache",
      bg: "",
      shadow: "",
      icon: "A23_Mustache",
      slot: 2,
      used: false
    },
    { 
      name: "Selfie Camera",
      fg: "A25_SelfieCamera_Sn",
      bg: "",
      shadow: "",
      icon: "A25_SelfieCamera",
      slot: 4,
      used: false
    },
    { 
      name: "Fairy Sweater",
      fg: "A26_FairySweater_Sn",
      bg: "",
      shadow: "",
      icon: "A26_FairySweater_Armsdown",
      slot: 3,
      used: false
    },
    { 
      name: "Poofy Jacket",
      fg: "A27_PoofJacket_Sn_FG",
      bg: "A27_PoofyJacket_Sn_BG",
      shadow: "",
      icon: "A27_PoofyJacket",
      slot: 3,
      used: false
    },
    { 
      name: "Fanny Pack",
      fg: "A28_FannyPack_Sn_FG",
      bg: "A28_FannyPack_Sn_BG",
      shadow: "",
      icon: "A28_FannyPack",
      slot: 4,
      used: false
    },
    { 
      name: "Inflatable Flamingo",
      fg: "A29_InflatableFlamingo_Sn_FG",
      bg: "A29_InflatableFlamingo_Sn_BG",
      shadow: "",
      icon: "A29_InflatableFlamingo",
      slot: 4,
      used: false
    },
    { 
      name: "Scarf",
      fg: "A31_Scarf_Sn",
      bg: "",
      shadow: "",
      icon: "A31_Scarf",
      slot: 3,
      used: false
    },
    { 
      name: "Vest",
      fg: "A32_Vest_Sn_FG",
      bg: "A32_Vest_Sn_BG",
      shadow: "",
      icon: "A32_Vest",
      slot: 3,
      used: false
    },
    { 
      name: "Mug",
      fg: "A33_SnoweeMug_Alt5",
      bg: "A33_SnoweeMug_Alt5",
      shadow: "",
      icon: "A24_CocoaMug",
      slot: 3,
      used: false
    },
    { 
      name: "Snowboard Goggles",
      fg: "A16_SnowboarderGlasses_Sn",
      bg: "A16_SnowboarderGlasses_Sn",
      shadow: "",
      icon: "A16_SnowboarderGlasses",
      slot: 1,
      used: false
    }
  ];