/**
 * Created by: Raj Meghpara
 * Date: 2022-01-07
 * Time: 16:45
 */

//libs
import dynamic from 'next/dynamic';

//component
import FullPageLoader from '@/components/fullPageLoader';

const ProfileListManager = dynamic(() => import(/* webpackChunkName: "profileListManager" */ './ProfileListManager'), {
  ssr: false,
  loading: () => <FullPageLoader />,
});

export { ProfileListManager };
