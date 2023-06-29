//libs
import dynamic from 'next/dynamic';

//components
import { Placeholder } from './components/Placeholder';

export const ProfilesUploader = dynamic(
  () => import(/* webpackChunkName: "profiles-uploader" */ './ProfilesUploader'),
  {
    loading: Placeholder,
  }
);
