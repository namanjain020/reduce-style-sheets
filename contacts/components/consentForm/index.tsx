/* Created by Gaurav on 21/07/21 */

import dynamic from 'next/dynamic';

//component
import FullPageLoader from '@/components/fullPageLoader';

const ConsentForm = dynamic(() => import(/*webpackChunkName: "dstConsentForm" */ './ConsentForm'), {
  ssr: false,
  loading: () => <FullPageLoader />,
});

export { ConsentForm };
