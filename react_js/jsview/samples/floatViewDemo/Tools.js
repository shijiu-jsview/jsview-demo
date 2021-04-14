/**
 * Created by ludl on 3/2/21.
 */

function getMainPath() {
    let url_parsed_left = window.location.href;

    // Remove hash
    let hash_idx = url_parsed_left.indexOf('#');
    if (hash_idx > 0) {
        // Remove hash from url parsed string
        url_parsed_left = url_parsed_left.substring(0, hash_idx);
    }

    // Remove search
    let search_idx = url_parsed_left.indexOf('?');
    if (search_idx > 1) {
        // Remove search from parsed string
        url_parsed_left = url_parsed_left.substring(0, search_idx);
    }

    return url_parsed_left;
}

export {
    getMainPath
}