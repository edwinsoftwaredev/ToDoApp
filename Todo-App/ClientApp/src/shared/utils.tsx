import {useLocation} from "react-router-dom";

/*
 * returns the current url
 **/
export const useQuery = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search);
}
