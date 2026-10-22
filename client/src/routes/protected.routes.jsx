import RestrictAccountSection from "../services/auth/RestrictAccountSection";
import RestrictFavourite from "../services/auth/RestrictFavourite";
import AccountSkeleton from "../utils/skeletons/account/AccountSkeleton";
import AccountSettingSkeleton from "../utils/skeletons/accountSettingSkeleton/AccountSettingSkeleton";
import ChangePasswordSkeleton from "../utils/skeletons/changePassword/ChangePasswordSkeleton";
import FavouriteSkeleton from "../utils/skeletons/favourite/FavouriteSkeleton";
import {
  LazyAccount,
  LazyAccountSetting,
  LazyChangePassword,
  LazyFavourite,
} from "./lazyPages";
import { LazyRouteElement } from "./lazyRouteElement";

export const protectedRoutes = [
  {
    path: "/favourite",
    element: (
      <RestrictFavourite>
        <LazyRouteElement
          component={LazyFavourite}
          fallback={<FavouriteSkeleton />}
        />
      </RestrictFavourite>
    ),
  },
  {
    path: "/account",
    element: (
      <RestrictAccountSection type="account">
        <LazyRouteElement
          component={LazyAccount}
          fallback={<AccountSkeleton />}
        />
      </RestrictAccountSection>
    ),
  },
  {
    path: "/account-setting",
    element: (
      <RestrictAccountSection type="accountSetting">
        <LazyRouteElement
          component={LazyAccountSetting}
          fallback={<AccountSettingSkeleton />}
        />
      </RestrictAccountSection>
    ),
  },
  {
    path: "/change-password",
    element: (
      <RestrictAccountSection type="changePassword">
        <LazyRouteElement
          component={LazyChangePassword}
          fallback={<ChangePasswordSkeleton />}
        />
      </RestrictAccountSection>
    ),
  },
];
