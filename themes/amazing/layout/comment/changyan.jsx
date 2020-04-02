const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');


// <!--PC和WAP自适应版-->
// <div id="SOHUCS" sid="请将此处替换为配置SourceID的语句" ></div>
// <script type="text/javascript">
//     (function(){
//         var appid = 'cyuLBn34q';
//         var conf = 'prod_9f05c3258ae61bca188b5672b10955ef';
//         var width = window.innerWidth || document.documentElement.clientWidth;
//         if (width < 960) {
//             window.document.write('<script id="changyan_mobile_js" charset="utf-8" type="text/javascript" src="http://cy-cdn.kuaizhan.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + '&conf=' + conf + '"><\/script>'); } else { var loadJs=function(d,a){var c=document.getElementsByTagName("head")[0]||document.head||document.documentElement;var b=document.createElement("script");b.setAttribute("type","text/javascript");b.setAttribute("charset","UTF-8");b.setAttribute("src",d);if(typeof a==="function"){if(window.attachEvent){b.onreadystatechange=function(){var e=b.readyState;if(e==="loaded"||e==="complete"){b.onreadystatechange=null;a()}}}else{b.onload=a}}c.appendChild(b)};loadJs("http://cy-cdn.kuaizhan.com/upload/changyan.js",function(){window.changyan.api.config({appid:appid,conf:conf})}); } })(); </script>


class ChangeYan extends Component {
    render() {
        const { appId, conf, path } = this.props;
        if (!appId || !conf) {
            return <div class="notification is-danger">
                You forgot to set the <code>app_id</code> or <code>conf</code> for Changyan.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const js = `window.changyan.api.config({appid: '${appId}',conf: '${conf}'});`;
        return <Fragment>
            <div id="SOHUCS" sid={path}></div>
            <script charset="utf-8" src="https://changyan.sohu.com/upload/changyan.js"></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(ChangeYan, 'comment.changyan', props => {
    const { comment, page } = props;

    return {
        appId: comment.app_id,
        conf: comment.conf,
        path: page.path
    };
});
