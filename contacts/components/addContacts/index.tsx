//libs
import dynamic from 'next/dynamic';

const AddContacts = dynamic(() => import(/* webpackChunkName: "addContacts" */ './AddContacts'), {
  ssr: false,
});

export { AddContacts };
