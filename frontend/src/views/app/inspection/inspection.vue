<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content" id="pdfContent">
      <breadcumb v-if="this.loadingType" :page=this.inType.txtInspectionType :folder="'Inspection'" />

      <b-form @submit.prevent="onSubmit('save')" @reset.prevent="onSubmit('close')">

      <!-- ################################################ -->
      <!-- ########### INSPECTION NUMBER SECTION ########## -->
      <!-- ################################################ -->
      <div class="row">
        <div class="col-md-12">
          <b-row>
            <b-col md="6">
              <!-- INSPECTION -->
              <div class="card bg-light"  v-if="this.loadingNumber">
                <div class="card-body p-0">
                  <h5 class="card-title p-3 pb-0 mb-0"><strong>Inspection Number</strong></h5>
                  <b-row class="mr-3 p-3 pt-0">
                    <b-col md="4" class="mt-3">
                      <h6 class="mb-1">Full Inspection Number</h6>
                      <b-input-group-text style="font-weight: 700;">{{ this.inNum.label }}-{{ this.inNum.type }}-{{ this.inNum.year }}-{{ this.inNum.number }}</b-input-group-text>
                    </b-col>
                    <b-col md="4" class="mt-3">
                      <h6 class="mb-1">Year</h6>
                      <b-form-input v-model="inNum.year" required type="tel" maxlength="4"></b-form-input>
                    </b-col>
                    <b-col md="4" class="mt-3">
                      <h6 class="mb-1">ID</h6>
                      <b-form-input v-model="inNum.number" required type="tel" maxlength="4"></b-form-input>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </b-col>
            <b-col md="6">
              <!-- DEVICE -->
              <div class="card bg-light" v-if="this.loadingDevice">
                <div class="card-body p-0">
                  <h5 class="card-title p-3 pb-0 mb-0"><strong>Device Model</strong></h5>
                  <b-row class="mr-3 p-3 pt-0">
                    <b-col md="4" class="mt-3">
                      <h6 class="mb-1">Model:</h6>
                      <b-input-group-text style="font-weight: 700;">{{ this.device.idDevice.idModel.txtModelName }}</b-input-group-text>
                    </b-col>
                    <b-col md="4" class="mt-3">
                      <h6 class="mb-1">Serial Number:</h6>
                      <b-input-group-text style="font-weight: 700;">{{ this.device.idDevice.txtSerialNumber }}</b-input-group-text>
                    </b-col>
                    <b-col md="4" class="mt-3">
                      <h6 class="mb-1">Device Position:</h6>
                      <b-input-group-text style="font-weight: 700;">{{ this.device.idDevice.idDevicePosition.txtDevicePosition }}</b-input-group-text>
                    </b-col>
                  </b-row>  
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>

      <!-- ##################################### -->
      <!-- ########### SAMPLE SECTION ########## -->
      <!-- ##################################### -->
      <div class="row mt-3" v-if="this.loadingSample" id="sample-section">
        <div class="col-md-12">
          <div class="card" id="card-item-1">
            <div class="card-body p-0">
              <b-row class="mr-3 p-3 pt-0 pb-0">
                <h5 class="card-title p-3 pb-0 mb-0">Samples</h5>
                <!-- <i class="nav-icon i-Billing mt-3" style="font-size: 20px" @click="printHTML()"></i> -->
              </b-row>
              <b-row class="mr-3 p-3 pt-0">
                <b-col md="12" class="mt-3">
                  <b-tabs content-class="mt-3">
                    <b-tab v-for="sample in samples" :key="sample.id" >
                      <template #title>Sample ID: {{ sample.id }}</template>
                      <b-container fluid v-if="loadingAttributes">
                        <b-row class="mb-3">
                          <b-col md="12" class="mb-1" v-if="returnFilteredAtts(sample, 'Integer').length >= 1">Parameter: Integer</b-col>
                          <b-col md="3" v-for="attribute in returnFilteredAtts(sample, 'Integer')" :key="attribute.id">
                            <b-input-group class="mb-3" :prepend="attribute.txtNameAttribute"> 
                              <b-form-input required v-model="attribute.txtValueAttribute" @change="saveSampleAttributes(attribute)"></b-form-input>
                            </b-input-group>
                          </b-col>
                        </b-row>
                        <b-row class="mb-3">
                          <b-col md="12" class="mb-1" v-if="returnFilteredAtts(sample, 'String').length >= 1">Parameter: String</b-col>
                          <b-col md="3" v-for="attribute in returnFilteredAtts(sample, 'String')" :key="attribute.id">
                            <b-input-group class="mb-3" :prepend="attribute.txtNameAttribute"> 
                              <b-form-input required v-model="attribute.txtValueAttribute" @change="saveSampleAttributes(attribute)"></b-form-input>
                            </b-input-group>
                          </b-col>
                        </b-row>
                        <b-row class="mb-3">
                          <b-col md="12" class="mb-1" v-if="returnFilteredAtts(sample, 'Float').length >= 1">Parameter: Float</b-col>
                          <b-col md="3" v-for="attribute in returnFilteredAtts(sample, 'Float')" :key="attribute.id">
                            <b-input-group class="mb-3" :prepend="attribute.txtNameAttribute" :append="attribute.txtParameter"> 
                              <b-form-input required v-model="attribute.txtValueAttribute" @change="saveSampleAttributes(attribute)"></b-form-input>
                            </b-input-group>
                          </b-col>
                        </b-row>
                        <b-row class="mb-3">
                          <b-col md="12" class="mb-1" v-if="returnFilteredAtts(sample, 'Boolean').length >= 1">Parameter: Boolean</b-col>
                          <b-col md="3" v-for="attribute in returnFilteredAtts(sample, 'Boolean')" :key="attribute.id">
                            <b-input-group class="mb-3" :prepend="attribute.txtNameAttribute" >
                              <b-form-select required v-model="attribute.txtValueAttribute" @change="saveSampleAttributes(attribute)">
                                <b-form-select-option value="true">True</b-form-select-option>
                                <b-form-select-option value="false">False</b-form-select-option>
                              </b-form-select>
                            </b-input-group>
                          </b-col>
                        </b-row>
                        <b-row class="mb-3">
                          <b-col md="12" class="mb-1" v-if="returnFilteredAtts(sample, 'Select').length >= 1">Parameter: Select</b-col>
                          <b-col md="3" v-for="attribute in returnFilteredAtts(sample, 'Select')" :key="attribute.id">
                            <b-input-group class="mb-3" :prepend="attribute.txtNameAttribute">
                              <b-form-select required v-model="attribute.txtValueAttribute" :options="getParameter(attribute.txtParameter)"
                               @change="saveSampleAttributes(attribute)"></b-form-select>
                            </b-input-group>
                          </b-col>
                        </b-row>
                      </b-container>
                    </b-tab>
                  </b-tabs>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>

      <!-- ######################################################## -->
      <!-- ########### RELEASE / NOTES / COMMENT SECTION ########## -->
      <!-- ######################################################## -->
      <div class="row mt-3" id="section_release_notes">
        <div class="col-md-12">
          <div class="card bg-light" id="card-notes">
            <div class="card-body p-0">
              <h5 class="card-title p-3 pb-0 mb-0"><strong>Release & Notes</strong></h5>
              <b-row class="mr-2 ml-2 mt-4 p-3 pt-0">
                <b-col md="4">
                  <b-input-group prepend="Auditor" >
                    <b-form-input required v-model="Inspector" placeholder="Enter your initials ..."></b-form-input>
                  </b-input-group>
                </b-col>
                <b-col md="4">
                  <b-input-group prepend="Requested By" >
                    <b-form-input required v-model="RequestedBy" placeholder="Enter your initials ..."></b-form-input>
                  </b-input-group>
                </b-col>
                <b-col md="4">
                  <b-input-group prepend="Inspection Status">
                    <b-form-select required v-model="inStatus" :options="optionsInspectionStatus"></b-form-select>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row  class="mr-2 ml-2 p-3 pt-0">
                <b-col md="4">
                  <b-input-group prepend="Inspection Date" >
                    <b-form-datepicker required v-model="DatInspection" placeholder="Enter your initials ..."></b-form-datepicker>
                  </b-input-group>
                </b-col>
                <b-col md="4">
                  <b-input-group prepend="Delivered On" >
                    <b-form-datepicker v-model="DatDeliveredOn" placeholder="Enter your initials ..."></b-form-datepicker>
                  </b-input-group>
                </b-col>
                <b-col md="4">
                  <b-input-group prepend="Requested On" >
                    <b-form-datepicker v-model="DatRequestedOn" placeholder="Enter your initials ..."></b-form-datepicker>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="mr-2 ml-2 mb-3 p-3 pt-0">
                <b-col md="12" class="mt-3">
                  <h5 class="mb-1">Comment</h5>
                  <b-form-textarea v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>

      <!-- SAVE BUTTON -->
        <b-button type="submit" class="mr-3 mt-3" size="lg" variant="success">Save</b-button>
        <b-button type="reset" class="mr-3 mt-3" size="lg" variant="outline-success">Save & Close</b-button>
        <!-- <b-button @click="createPDF" class="mr-3" variant="outline-primary">PDF</b-button> -->
      </b-form>

  </div>
  <!-- ============ Body content End ============= -->
</template>
<script>
import { apiService } from "@/common/api.service.js";
import { AgGridVue } from '@ag-grid-community/vue';
import $ from 'jquery';
// import print from 'print-js'
import { Color } from '@ag-grid-community/all-modules';

export default {
  metaInfo: {    
    title: "Edit Inspection"
  },
  components: {
    AgGridVue
  },
  data() {
    return {
      // VUE VARIABLES
      inspection: [],
      inNum: [],
      inType: [],
      inStatus: [],
      samples: [],
      sampleAttributes: [],
      activeSampleAttributes: [],
      device: [],


      // RELEASE & NOTES
      IStatus: 'Work In Progress',
      IType: null,
      DatInspection: null,
      DatDeliveredOn: null,
      DatRequestedOn: null,
      RequestedBy: null,
      Inspector: null,
      Comment: null,

      // BOOLEAN STATES
      loadingDevice: false,
      loadingSample: false,
      loadingAttributes: false,
      loadingNumber: false,
      loadingType: false,
      error: false,
      Superuser: false,

      // OPTIONS  
      optionsInspectionStatus: [
        { value: 'Work In Progress', text: 'Work In Progress' },
        { value: 'On Hold', text: 'On Hold' },
        { value: 'Complete', text: 'Complete' },
        { value: 'Declined', text: 'Declined' },
      ],
    };
  },
  beforeRouteEnter (to, from, next) {
    let id = localStorage.getItem('InspectionID')
      if(id == null || id == undefined) {
        next('/app/inspection/inspection-list');
      } else {
        next();
      }
  },
  beforeRouteLeave (to, from, next) {
      localStorage.removeItem('InspectionID')
      next();
  },
  computed: {
  },
  methods: {
    onSubmit(type) {
      if(type == 'save') {
        this.saveInspection();
      } else if(type == 'close') {
        this.saveInspection();
        setTimeout(() => {
          this.closeInspection();
        }, 2300);
      }
    },
    returnFilteredAtts(sample, type) {
      let el = this.sampleAttributes.filter(e => e.idSample == sample.id)
      const temp = el.filter(e => e.txtValueType == type)
      return temp;
    },
    closeInspection() {
      this.$router.push(`/app/inspection/inspection-list/`)
    },
    saveInspection() {
      let id = localStorage.getItem('InspectionID');
      let InspectionNumber = this.inNum.label + '-' + this.inNum.type + '-' + this.inNum.year + '-' + this.inNum.number;
      let endpoint = `/api/inspection/${id}/`;
      apiService(endpoint, "PATCH", {  
        txtInspectionNumber: InspectionNumber, 
        txtInspectionStatus: this.inStatus, 
        txtInspector: this.Inspector,
        datInspection: this.DatInspection,
        datDeliveredOn: this.DatDeliveredOn,
        datRequestedOn: this.DatRequestedOn,
        txtRequestedBy: this.RequestedBy,
        txtComment: this.Comment,
        })
        .then(response => {
          this.$bvToast.toast(`Saved successfully!`, {
            title: 'SUCCESS', variant: 'success', autoHideDelay: 2000, appendToast: false })
        })
    },
    saveSampleAttributes(att) {
      if(att !== undefined) {
        if(att.txtValueAttribute !== "" ) {
          let endpoint = `/api/sample-attribute/${att.id}/`;
          apiService(endpoint, "PATCH", {  
            txtValueAttribute: att.txtValueAttribute, 
            txtParameter: att.txtParameter, 
            })
        }
      }
    },
    fillInspection() {
      this.inStatus = this.inspection.txtInspectionStatus;
      this.Inspector = this.inspection.txtInspector;
      this.RequestedBy = this.inspection.txtRequestedBy;
      this.DatInspection = this.inspection.datInspection;
      this.DatDeliveredOn = this.inspection.datDeliveredOn;
      this.DatRequestedOn = this.inspection.datRequestedOn;
      this.Comment = this.inspection.txtComment;
    },
    getParameter(params) {
      let arr = [];
      let el = params.split(',');
      for (let i = 0; i < el.length; i++) {
        arr.push({ value: el[i], text: el[i] });
      }
      return arr;
    },
    getSamples(id) {
      this.samples = [];
      let endpoint = `/api/sample-list/`;
      apiService(endpoint)
        .then(data => {
          let el = [];
          el.push(...data.results);
          this.samples = el.filter(e => e.idInspection.id === id)
          this.loadingSample = true;
        })
        .catch(err => console.log(err));
    },
    getSampleAttributes() {
      this.sampleAttributes = [];
      let endpoint = `/api/sample-attribute/`;
      apiService(endpoint)
        .then(data => { 
          this.sampleAttributes.push(...data.results);
          this.loadingAttributes = true;
        })
        .catch(err => console.log(err));
    },
    getOrderDevice(id) {
      this.device = [];
      let endpoint = `/api/order-device-list/`;
      apiService(endpoint)
        .then(data => { 
          let el = [];
          el.push(...data.results);
          let temp = el.filter(e => e.id == id);
          this.device = temp[0];
          this.loadingDevice = true;
        })
        .catch(err => console.log(err));
    },
    getInspection() {
      let id = localStorage.getItem('InspectionID');
      let endpoint = `/api/inspection/${id}/`;
      apiService(endpoint)
        .then(data => { 
          this.inspection = data;
          this.fillInspection();
          this.getOrderDevice(this.inspection.idOrderDevice);
          this.getSamples(this.inspection.id);
          this.getInspectionNumber(this.inspection.txtInspectionNumber);
          this.getInspectionType(this.inspection.idInspectionType);
        })
        .catch(err => console.log(err));
    },
    getInspectionNumber(number) {
      let el = number.split('-');
      this.inNum = { label: el[0], type: el[1], year: el[2], number: el[3] };
      this.loadingNumber = true;
    },
    getInspectionType(id) {
      let endpoint = `/api/inspection-type/${id}/`;
      apiService(endpoint)
        .then(data => {
          this.inType = data;
          this.loadingType = true;
        })
        .catch(err => console.log(err));
    },
  },
  created() {
    this.getSampleAttributes();
    this.getInspection();
},
};
</script>
<style>
  html, body, div {
    box-sizing: border-box!important;
  }

  i:focus,
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
      outline: none;
  }

</style>
