<?php
///////////////////////////////////////
// フッターのカスタムフィールドを挿入
// フッターで呼び出すスクリプトなど
// カスタムフィールドに「footer_custom」と入力することで使用。
///////////////////////////////////////
if ( is_singular() ){//投稿・固定ページの場合
  $footer_custom = get_post_meta($post->ID, 'footer_custom', true);
  if ( $footer_custom ) {
    echo replace_directory_uri($footer_custom);
  }
}
?>