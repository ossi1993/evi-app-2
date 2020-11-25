<template>
  <div>
    <router-view></router-view>

    <customizer></customizer>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import { apiService } from "@/common/api.service.js";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getThemeMode"]),
    themeName() {
      return this.getThemeMode.dark ? "dark-theme" : " ";
    },
    rtl() {
      return this.getThemeMode.rtl ? "rtl" : " ";
    },
    getCookie() {
      const c_name = 'csrftoken'
      var c_value = document.cookie,
        c_start = c_value.indexOf(" " + c_name + "=");
      if (c_start == -1) c_start = c_value.indexOf(c_name + "=");
      if (c_start == -1) {
        c_value = null;
      } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
      }
      // return c_value;
      if (!c_value) {
        this.$router.push("/app/sessions/signIn");
      }
    }
  },
  metaInfo() {
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: "EVI",
      // all titles will be injected into this template
      titleTemplate: "%s | EVI",
      bodyAttrs: {
        class: [this.themeName, "text-left"]
      },
      htmlAttrs: {
        dir: this.rtl
      }
    };
  }
  
};
</script>

<style>
  .multiselect__tag {
    background-color: #003473!important;
  }
  .multiselect__tag-icon::after {
    color: #fff!important;
  }
  .multiselect__tag-icon:hover, .multiselect__option--highlight, .multiselect__option--highlight:after {
    background: #003473!important;
  }
  .multiselect__input, .multiselect__placeholder, .multiselect__option, .multiselect__tags {
    font-size: 14px!important;
  }
  .input-tag {
    background-color:#003473!important;
    color: #fff!important;
    border: 1px solid #003473!important;
  }
  .vue-input-tag-wrapper {
    vertical-align: baseline!important;
    height: calc(1.9695rem + 8px);
    background: #f8f9fa!important;
    border: 1px solid #ced4da!important;
  }
  .remove:empty:before {
    color: #fff!important;
  }
  .divider {
    border: solid 1px rgba(141, 141, 141, 0.404)!important;
    overflow: hidden!important;
  }
</style>


