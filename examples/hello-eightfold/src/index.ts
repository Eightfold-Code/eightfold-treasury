export interface HelloEightfoldParams {
  name: string;
}

export function eightfoldHello(params: HelloEightfoldParams): string {
  const name = params?.name || "Dino";
  return `Hello ${name} from Eightfold.`;
}

export default eightfoldHello;
