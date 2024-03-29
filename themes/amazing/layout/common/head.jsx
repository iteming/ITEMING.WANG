const { Component } = require('inferno');
const MetaTags = require('../misc/meta');
const OpenGraph = require('../misc/open_graph');
const StructuredData = require('../misc/structured_data');
const Plugins = require('./plugins');
const {stripHTML} = require('hexo-util');

function getPageTitle(page, siteTitle, helper) {
    let title = page.title;

    if (helper.is_archive()) {
        title = helper._p('common.archive', Infinity);
        if (helper.is_month()) {
            title += ': ' + page.year + '/' + page.month;
        } else if (helper.is_year()) {
            title += ': ' + page.year;
        }
    } else if (helper.is_category()) {
        title = helper._p('common.category', 1) + ': ' + page.category;
    } else if (helper.is_tag()) {
        title = helper._p('common.tag', 1) + ': ' + page.tag;
    } else if (helper.is_categories()) {
        title = helper._p('common.category', Infinity);
    } else if (helper.is_tags()) {
        title = helper._p('common.tag', Infinity);
    }

    return [title, siteTitle].filter(str => typeof str !== 'undefined' && str.trim() !== '').join(' - ');
}

module.exports = class extends Component {
    render() {
        const { env, site, config, helper, page } = this.props;
        const { url_for, cdn, my_cdn, iconcdn, fontcdn, is_post } = helper;
        const {
            url,
            meta_generator = true,
            head = {},
            article,
            highlight
        } = config;
        const {
            meta = [],
            open_graph = {},
            structured_data = {},
            canonical_url,
            rss,
            favicon
        } = head;

        const language = page.lang || page.language || config.language;
        const has_live_2D_switch = config.has_live_2D_switch;
        let hlTheme, images;
        if (highlight && highlight.enable === false) {
            hlTheme = null;
        } else if (article && article.highlight && article.highlight.theme) {
            hlTheme = article.highlight.theme;
        } else {
            hlTheme = 'atom-one-light';
        }

        if (typeof page.og_image === 'string') {
            images = [page.og_image];
        } else if (helper.has_thumbnail(page)) {
            images = [helper.get_thumbnail(page)];
        } else if (article && typeof article.og_image === 'string') {
            images = [article.og_image];
        } else if (page.content && page.content.includes('<img')) {
            let img;
            images = [];
            const imgPattern = /<img [^>]*src=['"]([^'"]+)([^>]*>)/gi;
            while ((img = imgPattern.exec(page.content)) !== null) {
                images.push(img[1]);
            }
        } else {
            images = [url_for('/img/og_image.png')];
        }

        let adsenseClientId = null;
        if (Array.isArray(config.widgets)) {
            const widget = config.widgets.find(widget => widget.type === 'adsense');
            if (widget) {
                adsenseClientId = widget.client_id;
            }
        }

        let openGraphImages = images;
        if ((Array.isArray(open_graph.image) && open_graph.image.length > 0) || typeof open_graph.image === 'string') {
            openGraphImages = open_graph.image;
        } else if ((Array.isArray(page.photos) && page.photos.length > 0) || typeof page.photos === 'string') {
            openGraphImages = page.photos;
        }

        let structuredImages = images;
        if ((Array.isArray(structured_data.image) && structured_data.image.length > 0) || typeof structured_data.image === 'string') {
            structuredImages = structured_data.image;
        } else if ((Array.isArray(page.photos) && page.photos.length > 0) || typeof page.photos === 'string') {
            structuredImages = page.photos;
        }

        const hasLive2D = has_live_2D_switch == undefined || has_live_2D_switch;
        return <head>
            <meta charset="utf-8" />
            {meta_generator ? <meta name="generator" content={`Hexo ${env.version}`} /> : null}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <MetaTags meta={meta} />

            <title>{getPageTitle(page, config.title, helper)}</title>

            {typeof open_graph === 'object' ? <OpenGraph
                type={(is_post(page) ? 'article' : 'website') || open_graph.type}
                title={page.title || open_graph.title || config.title}
                date={page.date}
                updated={page.updated}
                author={open_graph.author || config.author}
                description={page.description || stripHTML(page.excerpt) || open_graph.description || page.content || config.description}
                keywords={page.keywords || (page.tags && page.tags.length ? page.tags : undefined) || config.keywords}
                url={page.permalink || open_graph.url || url}
                images={openGraphImages}
                siteName={open_graph.site_name || config.title}
                language={language}
                twitterId={open_graph.twitter_id}
                twitterCard={open_graph.twitter_card}
                twitterSite={open_graph.twitter_site}
                googlePlus={open_graph.google_plus}
                facebookAdmins={open_graph.fb_admins}
                facebookAppId={open_graph.fb_app_id} /> : null}

            {typeof structured_data === 'object' ? <StructuredData
                title={page.title || structured_data.title || config.title}
                description={page.description || stripHTML(page.excerpt) || structured_data.description || page.content || config.description}
                url={page.permalink || structured_data.url || url}
                author={structured_data.author || config.author}
                date={page.date}
                updated={page.updated}
                images={structuredImages} /> : null}

            {canonical_url ? <link rel="canonical" href={canonical_url} /> : null}
            {rss ? <link rel="alternative" href={url_for(rss)} title={config.title} type="application/atom+xml" /> : null}
            {favicon ? <link rel="icon" href={url_for(favicon)} /> : null}
            <link rel="stylesheet" href={iconcdn()} />
            <link rel="stylesheet" href={fontcdn('Ubuntu:400,600|Source+Code+Pro|Monda:300,300italic,400,400italic,700,700italic|Roboto Slab:300,300italic,400,400italic,700,700italic|Microsoft YaHei:300,300italic,400,400italic,700,700italic|PT Mono:300,300italic,400,400italic,700,700italic&amp;subset=latin,latin-ext|Inconsolata|Itim|Lobster.css')} />
            {hlTheme ? <link rel="stylesheet" href={cdn('highlight.js', '9.12.0', 'styles/' + hlTheme + '.css')} /> : null}
            <Plugins site={site} config={config} helper={helper} page={page} head={true} />
            <link rel="stylesheet" href={my_cdn(url_for('/css/style.css'))} />
            <script src={cdn('jquery', '3.3.1', 'dist/jquery.min.js')}></script>
            <script src={my_cdn(url_for('/js/globalUtils.js'))}></script>
            {adsenseClientId ? <script data-ad-client={adsenseClientId}
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" async={true}></script> : null}
            {hasLive2D ? <link rel="stylesheet" href={my_cdn(url_for('/live2d/waifu.css'))} /> : null}
            {hasLive2D ? <script type="text/javascript" async={true} src={my_cdn(url_for('/live2d/autoload.js'))}></script> : null}

        </head>;
    }
};
