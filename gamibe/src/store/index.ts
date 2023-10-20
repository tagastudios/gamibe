import { atom, useAtom } from "jotai";

const initialState = {
	//
};

const Store = {
	globalAtom: atom<object>(initialState),
	globalScope: Symbol(),
};

const useStore = (slice: string) => {
	const { globalAtom, globalScope } = Store;
	const [data, setData]: any = useAtom(globalAtom, globalScope);
	return [data, setData];
};

export default Store;
export { useStore };
