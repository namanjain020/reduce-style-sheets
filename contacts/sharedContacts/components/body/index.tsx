//libs
import dynamic from 'next/dynamic';

//constants
import { MACRO_NAMESPACE } from '@sprinklr/modules/macro/i18n';

//hocs
import { wrapWithSuspense } from '@sprinklr/modules/infra/hocs/wrapWithSuspense';
import { withLoadNamespaces } from '@sprinklr/modules/infra/hocs/withLoadNamespace';

//components
import { ContactCardWithActionsPlaceholders } from '@/modules/contacts/components/placeholders/ContactCardWithActionsPlaceholders';

const Placeholder = (): JSX.Element => <ContactCardWithActionsPlaceholders count={6} />;

const Body = wrapWithSuspense(Placeholder)(
  dynamic(() => import(/* : "shared-contacts-body" */ './Body').then(mod => mod.Body), {
    ssr: false,
    loading: withLoadNamespaces(MACRO_NAMESPACE)(Placeholder),
  })
);

export { Body };
