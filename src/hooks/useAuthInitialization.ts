// hooks/useAuthInitialization.ts
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useAppDispatch } from "../store/store";
import { resetFilters } from "../store/slices/filter-slice";

export const useAuthInitialization = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      dispatch(resetFilters());
    }
  }, [isSignedIn, isLoaded, dispatch]);
};
