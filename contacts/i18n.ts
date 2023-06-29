import { build } from '@sprinklr/modules/sprI18Next';

const CONTACTS_NAMESPACE = 'contacts';
const CONTACTS_WORKFLOW_NAMESPACE = 'contactsWorkflow';

const { useContactsTranslation } = build(CONTACTS_NAMESPACE);
const { useContactsWorkflowTranslation } = build(CONTACTS_WORKFLOW_NAMESPACE);

export { useContactsTranslation, CONTACTS_NAMESPACE, useContactsWorkflowTranslation, CONTACTS_WORKFLOW_NAMESPACE };

export type ContactsTranslationFn = ReturnType<typeof useContactsTranslation>['__contactsT'];
export type ContactsWorkflowTranslationFn = ReturnType<typeof useContactsWorkflowTranslation>['__contactsWorkflowT'];
