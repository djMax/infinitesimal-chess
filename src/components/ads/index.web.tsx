import { getRemoteConfiguration } from '../../adapters/firebase-common';

const html = `<ins className="adsbygoogle" style="display:block" data-ad-client="ca-pub-5250702741281167" data-ad-slot="2601113570" data-ad-format="auto" data-full-width-responsive="true"`;

export function MultiplayerWaitBanner() {
  const showAds = getRemoteConfiguration<boolean>('show_ads', 'boolean');
  return showAds ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null;
}
