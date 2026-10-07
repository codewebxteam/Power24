import { useEffect } from 'react';

/**
 * SEO Helper Component for dynamic page metadata
 * Automatically sets document title, meta tags, and Open Graph cards for Google & Social Crawlers.
 */
const SEO = ({
  title,
  description = "Power24 (Power 24 Solar) is Uttar Pradesh's leading solar rooftop company. Authorized PM Surya Ghar Muft Bijli Yojana vendor offering Tier-1 solar panels, rooftop installation, and government subsidy up to ₹1,08,000.",
  canonical,
  keywords,
  ogImage = "https://ik.imagekit.io/qvztwdsij/solar%20hero%20-%20Copy.png?updatedAt=1790432262362"
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title
      ? `${title} | Power24 Solar (Power 24)`
      : 'Power24 Solar | Power 24 - No.1 Rooftop Solar Company & PM Surya Ghar in UP';
    document.title = formattedTitle;

    // 2. Helper to update or create meta tags
    const setMetaTag = (attribute, attrValue, content) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update standard meta tags
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // Update Open Graph and Twitter Titles
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('name', 'twitter:image', ogImage);

    // 3. Update Canonical Tag
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonical);
      setMetaTag('property', 'og:url', canonical);
    }
  }, [title, description, canonical, keywords, ogImage]);

  return null;
};

export default SEO;
