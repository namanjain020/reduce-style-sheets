//libs
import dynamic from 'next/dynamic';

//components
import { Placeholder } from './Placeholder';

export const CreateProfileList = dynamic(
  () => import(/* webpackChunkName: "create-profile-list" */ './CreateProfileList'),
  {
    ssr: false,
    loading: Placeholder,
  }
);
