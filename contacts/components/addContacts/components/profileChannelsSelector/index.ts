/**
 * Created by: Raj Meghpara
 * Date: 2021-08-10
 * Time: 18:57
 */

//libs
import dynamic from 'next/dynamic';

//components
import { Placeholder } from './components/Placeholder';

export const ProfileChannelsSelector = dynamic(
  () => import(/* webpackChunkName: "profile-channels-selector" */ './ProfileChannelsSelector'),
  {
    loading: Placeholder,
  }
);
