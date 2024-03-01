import { Image } from "react-native";

export type ItemData = {
    id: string;
    picture: Image;
    title: string;
    total_emission: number;
    transportation_emissions: any;
    production_emissions: any;
    packaging_emissions: any;
    disposal_emissions: any;
  };
  
export type MultiSizeItem = {
    id: string;
    picture: Image;
    title: string;
    items: Omit<ItemData, "picture">[];
};

export type SelectedItem = {
    count: number;
    item: ItemData;
  };