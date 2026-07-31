/**
 * Endpoint the contact form POSTs to.
 *
 * Ships empty on purpose. While it is empty the form still renders and
 * validates, but submitting reports "endpoint not configured" rather than
 * pretending to send — a silent no-op would lose real messages.
 *
 * To switch it on, create a form at https://formspree.io and paste the URL:
 *   export const CONTACT_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
 */
// Annotated as `string` rather than inferred so filling it in later does not
// change the type and TypeScript never narrows the empty case to unreachable.
export const CONTACT_ENDPOINT: string = '';

/** Path to the CV served out of /public. */
export const CV_PATH = '/Abdulaziz_Alsuhaibani_FullStackDeveloper.pdf';

export const CV_FILENAME = 'Abdulaziz_Alsuhaibani_FullStackDeveloper.pdf';
