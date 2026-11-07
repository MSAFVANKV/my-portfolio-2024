import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { AppDispatch, RootState, store } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector :TypedUseSelectorHook<RootState> = useSelector


export const dispatch: AppDispatch = store.dispatch;