<template>
  <!-- ============ Body content start ============= -->
  <div class="main-content" id="pdfContent">
      <breadcumb :page=this.templates.txtInspectionTemplateName :folder="'Inspection'" />

      <!-- INSPECTION NUMBER -->
      <div class="row">
        <div class="col-md-12">
          <div class="card bg-light">
            <div class="card-body p-0">
              <h5 class="card-title p-3 pb-0 mb-0">Inspection Number</h5>
              <b-row class="mr-3 p-3 pt-0">
                <b-col md="3" class="mt-3">
                  <h6 class="mb-1">Full Inspection Number</h6>
                  <b-input-group-text style="font-weight: 700;">{{ this.inspectNumber.label }}-{{ this.inspectNumber.type }}-{{ this.inspectNumber.year }}-{{ this.inspectNumber.number }}</b-input-group-text>
                </b-col>
                <b-col md="3" class="mt-3">
                  <h6 class="mb-1">Year</h6>
                  <b-form-input v-model="inspectNumber.year" type="tel" maxlength="4"></b-form-input>
                </b-col>
                <b-col md="3" class="mt-3">
                  <h6 class="mb-1">ID</h6>
                  <b-form-input v-model="inspectNumber.number" type="tel" maxlength="4"></b-form-input>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>

      <!-- DEVICE MODEL -->
      <div class="row mt-4">
        <div class="col-md-12">
          <div class="card" id="card-device">
            <div class="card-body p-0">
              <h5 class="card-title p-3 pb-0 mb-0">Device Model</h5>
              <b-row class="mr-3 p-3 pt-0">
                <b-col md="3" class="mt-3">
                  <v-select  id="device-select-1" v-model="Manufacturer" :options="optionManufacturer"
                  label="txtManufacturerName" required placeholder="Choose Manufacturer" :reduce="Manufacturer => Manufacturer.id"
                  ></v-select>
                </b-col>
                <b-col md="3" class="mt-3" v-if="Manufacturer">
                  <v-select  id="device-select-2" v-model="Supplier" :options="optionSupplier" @input="searchFilterModel($event)"
                  label="txtSupplierName" required placeholder="Choose Supplier" :reduce="Supplier => Supplier.id"
                  ></v-select>
                </b-col>
                <b-col md="3" class="mt-3" v-if="Manufacturer && Supplier">
                  <v-select  id="device-select-3" v-model="Model" :options="filteredModel" @input="searchFilterDevice($event)"
                  label="txtModelName" required placeholder="Choose Model" :reduce="Model => Model.id"
                  ></v-select>
                </b-col>
                <b-col md="3" class="mt-3" v-if="Manufacturer && Supplier && Model">
                  <v-select  id="device-select-4" v-model="Device" :options="filteredDevice" :getOptionLabel="filteredDevice => filteredDevice.idDevice.txtSerialNumber"
                  label="txtSerialNumber" required placeholder="Choose Device"
                  ></v-select>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>

      <!-- ITEM 1 -->
      <div class="row mt-3" v-if="setItemOne">
        <div class="col-md-12">
          <div class="card" id="card-item-1">
            <div class="card-body p-0">
              <h5 class="card-title p-3 pb-0 mb-0">Item 1</h5>
              <b-row class="mr-3 p-3 pt-0">
                <b-col md="3" class="mt-3">
                  <v-select  id="item-select-1" v-model="ItemTypeOne" :options="optionItemType" @input="searchFilterItemTypeOne($event)"
                  label="txtType" required placeholder="Choose Type"
                  ></v-select>
                </b-col>
                <b-col md="3" class="mt-3" v-if="ItemTypeOne">
                  <v-select  id="item-select-2" v-model="ItemVersionOne" :options="filteredItemTypeOne" @input="searchFilterItemVersionOne($event)"
                  label="txtVersion" required placeholder="Choose Version"
                  ></v-select>
                </b-col>
                <b-col md="3" class="mt-3" v-if="ItemTypeOne && ItemVersionOne">
                  <v-select  id="item-select-3" v-model="selectedItemOne" :options="filteredItemVersionOne" @input="setSelectedItem" 
                  label="id" required placeholder="Choose Item" :getOptionLabel="OrderItem => OrderItem.idItem.txtArticlenumber"
                  ></v-select>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>

      <!-- ITEM 2 -->
      <div class="row  mt-3" v-if="setItemTwo">
        <div class="col-md-12">
          <div class="card" id="card-item-2">
            <div class="card-body p-0">
              <h5 class="card-title p-3 pb-0 mb-0">Item 2</h5>
              <b-row class="mr-3 p-3 pt-0">
                <b-col md="3" class="mt-3">
                  <v-select  id="item-select-4" v-model="ItemTypeTwo" :options="optionItemType" @input="searchFilterItemTypeTwo($event)"
                  label="txtType" required placeholder="Choose Type"
                  ></v-select>
                </b-col>
                <b-col md="3" class="mt-3" v-if="ItemTypeTwo">
                  <v-select  id="item-select-5" v-model="ItemVersionTwo" :options="filteredItemTypeTwo" @input="searchFilterItemVersionTwo($event)"
                  label="txtVersion" required placeholder="Choose Version"
                  ></v-select>
                </b-col>
                <b-col md="3" class="mt-3" v-if="ItemTypeTwo && ItemVersionTwo">
                  <v-select  id="item-select-6" v-model="selectedItemTwo" :options="filteredItemVersionTwo" @input="setSelectedItem"
                  label="id" required placeholder="Choose Item" :getOptionLabel="OrderItem => OrderItem.idItem.txtArticlenumber"
                  ></v-select>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>

      <!-- ITEM 3 -->
      <div class="row  mt-3" v-if="setItemThree">
        <div class="col-md-12">
          <div class="card" id="card-item-3">
            <div class="card-body p-0">
              <h5 class="card-title p-3 pb-0 mb-0">Item 3</h5>
              <b-row class="mr-3 p-3 pt-0">
                <b-col md="3" class="mt-3">
                  <v-select  id="item-select-7" v-model="ItemTypeThree" :options="optionItemType" @input="searchFilterItemTypeTwo($event)"
                  label="txtType" required placeholder="Choose Type"
                  ></v-select>
                </b-col>
                <b-col md="3" class="mt-3" v-if="ItemTypeThree">
                  <v-select  id="item-select-8" v-model="ItemVersionThree" :options="filteredItemTypeThree" @input="searchFilterItemVersionTwo($event)"
                  label="txtVersion" required placeholder="Choose Version"
                  ></v-select>
                </b-col>
                <b-col md="3" class="mt-3" v-if="ItemTypeThree && ItemVersionThree">
                  <v-select  id="item-select-9" v-model="selectedItemThree" :options="filteredItemVersionThree" @input="setSelectedItem"
                  label="id" required placeholder="Choose Item" :getOptionLabel="OrderItem => OrderItem.idItem.txtArticlenumber"
                  ></v-select>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>

      <!-- INSPECTION PARAMETER TYPE: GLASS -->
      <div class="row mt-3" v-if="glassAttStatus">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body p-0 mb-3 mt-3">
              <h5 class="card-title p-3 pb-0 mb-0 ml-2">Glass Parameter</h5>
              <div class="mr-3 p-3 pt-0">
                <b-row class="ml-2 mr-2 mt-1" v-if="this.glassAtt1.length > 0"> <!-- Measure Unit mm -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in glassAtt1" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.glassAtt2.length > 0"> <!-- Measure Unit µm -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in glassAtt2" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.glassAtt3.length > 0"> <!-- Measure Unit g -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in glassAtt3" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.glassAtt4.length > 0"> <!-- Measure Unit BOOLEAN -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in glassAtt4" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-select>
                        <b-form-select-option value="true">Yes</b-form-select-option>
                        <b-form-select-option value="false">No</b-form-select-option>
                      </b-form-select>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.glassAtt5.length > 0"> <!-- Everything else -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in glassAtt5" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- INSPECTION PARAMETER TYPE: CASE -->
      <div class="row mt-3" v-if="caseAttStatus">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body p-0 mb-3 mt-3">
              <h5 class="card-title p-3 pb-0 mb-0 ml-2">Case Parameter</h5>
              <div class="mr-3 p-3 pt-0">
                <b-row class="ml-2 mr-2 mt-1" v-if="this.caseAtt1.length > 0"> <!-- Measure Unit mm -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in caseAtt1" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.caseAtt2.length > 0"> <!-- Measure Unit µm -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in caseAtt2" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.caseAtt3.length > 0"> <!-- Measure Unit g -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in caseAtt3" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.caseAtt4.length > 0"> <!-- Measure Unit BOOLEAN -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in caseAtt4" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-select>
                        <b-form-select-option value="true">Yes</b-form-select-option>
                        <b-form-select-option value="false">No</b-form-select-option>
                      </b-form-select>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.caseAtt5.length > 0"> <!-- Everything else -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in caseAtt5" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- INSPECTION PARAMETER TYPE: FRAME STANDARD -->
      <div class="row mt-3" v-if="frameSAttStatus">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body p-0 mb-3 mt-3">
              <h5 class="card-title p-3 pb-0 mb-0 ml-2">Frame Standard Parameter</h5>
              <div class="mr-3 p-3 pt-0">
                <b-row class="ml-2 mr-2 mt-1" v-if="this.frameSAtt1.length > 0"> <!-- Measure Unit mm -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in frameSAtt1" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.frameSAtt2.length > 0"> <!-- Measure Unit µm -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in frameSAtt2" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.frameSAtt3.length > 0"> <!-- Measure Unit g -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in frameSAtt3" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.frameSAtt4.length > 0"> <!-- Measure Unit BOOLEAN -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in frameSAtt4" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-select>
                        <b-form-select-option value="true">Yes</b-form-select-option>
                        <b-form-select-option value="false">No</b-form-select-option>
                      </b-form-select>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.frameSAtt5.length > 0"> <!-- Everything else -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in frameSAtt5" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- INSPECTION PARAMETER TYPE: FRAME ECO -->
      <div class="row mt-3" v-if="frameEAttStatus">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body p-0 mb-3 mt-3">
              <h5 class="card-title p-3 pb-0 mb-0 ml-2">Frame Eco Parameter</h5>
              <div class="mr-3 p-3 pt-0">
                <b-row class="ml-2 mr-2 mt-1" v-if="this.frameEAtt1.length > 0"> <!-- Measure Unit mm -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in frameEAtt1" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.frameEAtt2.length > 0"> <!-- Measure Unit µm -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in frameEAtt2" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.frameEAtt3.length > 0"> <!-- Measure Unit g -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in frameEAtt3" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.frameEAtt4.length > 0"> <!-- Measure Unit BOOLEAN -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in frameEAtt4" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-select>
                        <b-form-select-option value="true">Yes</b-form-select-option>
                        <b-form-select-option value="false">No</b-form-select-option>
                      </b-form-select>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="ml-2 mr-2 mt-1" v-if="this.frameEAtt5.length > 0"> <!-- Everything else -->
                  <b-col md="12" class="divider mt-3"></b-col>
                  <b-col md="3" v-for="attribute in frameEAtt5" :key="attribute.id">
                    <b-input-group class="mt-3" :prepend="attribute.txtNameAttribute" >
                      <b-form-input v-model="attribute.txtValueDefault"></b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RELEASE / NOTES / COMMENT -->
      <div class="row mt-3" id="section_release_notes">
        <div class="col-md-12">
          <div class="card" id="card-notes">
            <div class="card-body p-0">
              <h5 class="card-title p-3 pb-0 mb-0">Release & Notes</h5>
              <b-row class="mr-2 ml-2 mt-4 p-3 pt-0">
                <b-col md="6">
                  <b-input-group prepend="Auditor" >
                    <b-form-input v-model="Inspector" placeholder="Enter your initials ..."></b-form-input>
                  </b-input-group>
                </b-col>
                <b-col md="6">
                  <b-input-group prepend="Requested By" >
                    <b-form-input v-model="RequestedBy" placeholder="Enter your initials ..."></b-form-input>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row  class="mr-2 ml-2 p-3 pt-0">
                <b-col md="4">
                  <b-input-group prepend="Inspection Date" >
                    <b-form-datepicker id="datepicker1" v-model="DatInspection" placeholder="Enter your initials ..."></b-form-datepicker>
                  </b-input-group>
                </b-col>
                <b-col md="4">
                  <b-input-group prepend="Delivered On" >
                    <b-form-datepicker id="datepicker3" v-model="DatDeliveredOn" placeholder="Enter your initials ..."></b-form-datepicker>
                  </b-input-group>
                </b-col>
                <b-col md="4">
                  <b-input-group prepend="Requested On" >
                    <b-form-datepicker id="datepicker2" v-model="DatRequestedOn" placeholder="Enter your initials ..."></b-form-datepicker>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="mt-3 mr-3 ml-3">
                <b-col md="12" class="divider"></b-col>
              </b-row>
              <!-- <b-row class="mt-4 mr-2 ml-2 p-3 pt-0">
                <b-col md="6">
                  <b-input-group prepend="Release" >
                    <b-form-select id="select-2" v-model="Release" :options="optionRelease" :disabled="this.Superuser"></b-form-select>
                  </b-input-group>
                </b-col>
                <b-col md="6">
                  <b-input-group prepend="Released by" >
                    <b-form-input id="select-2" v-model="ReleaseBy" :options="optionRelease" :disabled="this.Superuser" placeholder="Enter your initials ..."></b-form-input>
                  </b-input-group>
                </b-col>
              </b-row> -->
              <b-row class="mr-2 ml-2 mb-3 p-3 pt-0">
                <b-col md="12" class="mt-3">
                  <h5 class="mb-1">Comment</h5>
                  <b-form-textarea id="area-1" v-model="Comment" placeholder="Enter memo ..." rows="3" max-rows="6"></b-form-textarea>
                </b-col>
              </b-row>
              <!-- <b-row class="mr-2 ml-2 mb-3 p-3 pt-0">
                <b-col md="4">
                  <b-form-group label="File Upload:" label-for="file-default">
                    <b-form-file v-model="file" id="file-default" multiple :file-name-formatter="formatNames"></b-form-file>
                  </b-form-group>
                </b-col>
              </b-row> -->
            </div>
          </div>
        </div>
      </div>
    <b-row class="ml-3 mr-3 mt-4">
      <b-button @click="addInspection" class="mr-3" variant="primary" :disabled="disabled">Save Inspection</b-button>
      <b-button @click="createPDF" class="mr-3" variant="outline-primary">PDF</b-button>
    </b-row>
  </div>
  <!-- ============ Body content End ============= -->
</template>
<script>
import { apiService } from "@/common/api.service.js";
import { AgGridVue } from '@ag-grid-community/vue';
import $ from 'jquery';
import print from 'print-js'
import { Color } from '@ag-grid-community/all-modules';

export default {
  metaInfo: {    
    title: "New Inspection"
  },
  components: {
    AgGridVue
  },
  data() {
    return {
      // TEST VARIABLES
      el: '',
      elements: [],

      // DEVICE VARIABLES
      inspections: [],
      manufacturers: [],
      suppliers: [],
      models: [],
      devices: [],
      Manufacturer: '',
      Supplier: '',
      Model: '',
      Device: '',
      optionManufacturer: [],
      optionSupplier: [],
      optionModel: [],
      optionOrderDevice: [],
      filteredModel: '',
      filteredDevice: '',

      // ITEM VARIABLES
      Item: [],
      ItemTypeOne: null,
      ItemTypeTwo: null,
      ItemTypeThree: null,
      ItemVersionOne: null,
      ItemVersionTwo: null,
      ItemVersionThree: null,
      selectedItemOne: null,
      selectedItemTwo: null,
      selectedItemThree: null,
      items: [],
      orderItems: [],
      optionItem: [],
      optionItemType: [],
      optionItemVersion: [],
      optionOrderItem: [],
      filteredItemTypeOne: [],
      filteredItemTypeTwo: [],
      filteredItemTypeThree: [],
      filteredItemVersionOne: [],
      filteredItemVersionTwo: [],
      filteredItemVersionThree: [],
      setItemOne: false,
      setItemTwo: false,
      setItemThree: false,

      // TEMPLATE VARIABLES
      templates: [],
      glassAttStatus: false,
      frameSAttStatus: false,
      frameEAttStatus: false,
      caseAttStatus: false,
      glassAtt1: [],
      glassAtt2: [],
      glassAtt3: [],
      glassAtt4: [],
      glassAtt5: [],
      caseAtt1: [],
      caseAtt2: [],
      caseAtt3: [],
      caseAtt4: [],
      caseAtt5: [],
      frameSAtt1: [],
      frameSAtt2: [],
      frameSAtt3: [],
      frameSAtt4: [],
      frameSAtt5: [],
      frameEAtt1: [],
      frameEAtt2: [],
      frameEAtt3: [],
      frameEAtt4: [],
      frameEAtt5: [],
      attsDisctinct: 0,

      // INSPECTION NUMBER
      inspectNumber: [],

      // RELEASE & NOTES
      IStatus: 'Work In Progress',
      IType: null,
      DatInspection: null,
      DatDeliveredOn: null,
      DatRequestedOn: null,
      RequestedBy: null,
      Inspector: null,
      // Release: 'NO',
      // ReleaseBy: null,
      Comment: null,
      // optionRelease: [
      //   { value: 'YES', text: 'Yes' },
      //   { value: 'NO', text: 'No' },
      //   { value: 'CONDITIONALLY', text: 'Conditionally' },
      // ],

      // VUE VARIABLES
      error: false,
      InspectionNumber: '',
      Superuser: false,
    };
  },
  beforeRouteLeave (to, from, next) {
      localStorage.removeItem('ITempID')
      localStorage.removeItem('ITempType')
      next();
  },
  computed: {
    disabled: function() {
      return !this.Inspector ? true : !this.RequestedBy ? true : !this.DatInspection ? true : false;
    },
  },
  methods: {
    createPDF() {
      this.$htmlToPaper('pdfContent')
    },
    setSelectedItem() {
      this.Item = [];
      if(this.selectedItemOne) {
        if(this.selectedItemTwo) {
          if(this.selectedItemThree) {
            this.Item.push(this.selectedItemOne, this.selectedItemTwo, this.selectedItemThree)
          } else {
            this.Item.push(this.selectedItemOne, this.selectedItemTwo)
          }
        } else {
          this.Item.push(this.selectedItemOne)
        }
      }
    },
    searchFilterModel(event) {
      if (event) {
        try { this.filteredModel = this.optionModel.filter(e => e.idManufacturer == this.Manufacturer && e.idSupplier == event); }
        catch(e) {}
      }
    },
    searchFilterDevice(event) {
      if (event) {
        try { this.filteredDevice = this.optionOrderDevice.filter(e => e.idDevice.idModel.id == event && e.txtDeliveryStatus == 'Delivered'); }
        catch(e) {}
      }
    },
    searchFilterItemTypeOne(event) {
      if (event) {
        try { 
          const result = this.optionItem.filter(e => e.txtType == event); 
          const arr = [];
          const map = new Map();
          for (const item of result) {
            if(!map.has(item.txtVersion)){
              map.set(item.txtVersion, true);
              arr.push(item.txtVersion);
            }
          } this.filteredItemTypeOne = arr;
        } catch(e) {} }
    },
    searchFilterItemTypeTwo(event) {
      if (event) {
        try { 
          const result = this.optionItem.filter(e => e.txtType == event); 
          const arr = [];
          const map = new Map();
          for (const item of result) {
            if(!map.has(item.txtVersion)){
              map.set(item.txtVersion, true);
              arr.push(item.txtVersion);
            }
          } this.filteredItemTypeTwo = arr;
        } catch(e) {} }
    },
    searchFilterItemVersionOne(event) {
      if (event) {
        try { this.filteredItemVersionOne = this.optionOrderItem.filter(e => e.idItem.txtVersion == event && e.idItem.txtType == this.ItemTypeOne && e.txtDeliveryStatus == 'Delivered'); }
        catch(e) {}
      }
    },
    searchFilterItemVersionTwo(event) {
      if (event) {
        try { this.filteredItemVersionTwo = this.optionOrderItem.filter(e => e.idItem.txtVersion == event && e.idItem.txtType == this.ItemTypeTwo && e.txtDeliveryStatus == 'Delivered'); }
        catch(e) {}
      }
    },
    searchFilterItemVersionThree(event) {
      if (event) {
        try { this.filteredItemVersionThree = this.optionOrderItem.filter(e => e.idItem.txtVersion == event && e.idItem.txtType == this.ItemTypeThree && e.txtDeliveryStatus == 'Delivered'); }
        catch(e) {}
      }
    },
    addInspection() {
      let inspectID = this.inspectNumber.label + '-' + this.inspectNumber.year + '-' + this.inspectNumber.number;
      let endpoint = `/api/inspection/`;
      apiService(endpoint, "POST", {  txtInspectionNumber: inspectID, txtInspectionStatus: this.IStatus, txtInspectionType: this.templates.txtInspectionTemplateType,
        txtInspector: this.Inspector, datInspection: this.DatInspection, datDeliveredOn: this.DatDeliveredOn, datRequestedOn: this.DatRequestedOn,
        txtRequestedBy: this.RequestedBy, txtComment: this.Comment, idOrderDevice: this.Device.id, })
        .then(response => {
          if (response != 'ERROR') {
            for (let i = 0; i < this.Item.length; i++) {
              let element = this.Item[i];
              let attributes = [];
              let endpointSample = `/api/sample/`;
              apiService(endpointSample, "POST", { idInspection: response.id, idOrderItem: element.id })
              .then(response => {
                if(element.idItem.txtType == "Glass") {
                  attributes = this.glassAtt1.concat(this.glassAtt2, this.glassAtt3, this.glassAtt4, this.glassAtt5)
                } else if(element.idItem.txtType == "Case") {
                  attributes = this.caseAtt1.concat(this.caseAtt2, this.caseAtt3, this.caseAtt4, this.caseAtt5)
                } else if(element.idItem.txtType == "Frame Standard") {
                  attributes = this.frameSAtt1.concat(this.frameSAtt2, this.frameSAtt3, this.frameSAtt4, this.frameSAtt5)
                } else if(element.idItem.txtType == "Frame Eco") {
                  attributes = this.frameEAtt1.concat(this.frameEAtt2, this.frameEAtt3, this.frameEAtt4, this.frameEAtt5)
                }
                for (let e = 0; e < attributes.length; e++) {
                  let el = attributes[e];
                  let endpointAttribute = `/api/sample-attribute/`;
                  apiService(endpointAttribute, "POST", { 
                    idSample: response.id, 
                    txtKeyAttribute: el.txtKeyAttribute, 
                    txtNameAttribute: el.txtNameAttribute, 
                    txtValueAttribute: el.txtValueDefault, 
                    txtValueType: el.txtValueType, 
                    txtParameter: el.txtParameter, 
                    txtValueMin: el.txtValueMin, 
                    txtValueMax: el.txtValueMax, 
                    txtValueTolerance: el.txtValueTolerance, 
                    })
                };
              })
            }
            this.$router.push('inspection-list')
          }
        })
        .catch(err => console.log(err));
    },
    getInspectionNumber() {
      let endpoint = `/api/inspection/`;
      apiService(endpoint)
        .then(data => {
          this.inspections.push(...data.results);
          let d = new Date();
          let y = d.getFullYear();
          let pn = [];
          let type = localStorage.getItem('ITempType');
          for (let i = 0; i < this.inspections.length; i++) {
            pn.push(this.inspections[i].txtInspectionNumber.split('-'));
          }
          let sequence = String(parseInt(pn[pn.length-1][2]) + 1);
          for (let e = sequence.length; e < 4; e++) {
            sequence = '0' + sequence;
          }
          if(parseInt(pn[pn.length-1][1] != y)) {
            this.inspectNumber = { label: 'IN', year: y, number: 1, type: type };
          } else {
            this.inspectNumber = { label: 'IN', year: y, number: sequence, type: type };
          }
        })
        .catch(err => console.log(err));
    },
    getTemplate() {
      if (!this.error) {
        var tempId = localStorage.getItem('ITempID')
        let endpoint = `/api/inspection-template-list/${tempId}/`;
        apiService(endpoint)
          .then(data => {
            this.templates = data;
            var atts = this.templates.idInspectionTemplateAttribute
            let distinct = [...new Set(atts.map(x => x.txtItemType))];
            this.attsDisctinct = distinct.length;
            if(this.attsDisctinct >= 1) {
              if(this.attsDisctinct >= 2) {
                if(this.attsDisctinct >= 3) {
                  this.setItemOne = true;
                  this.setItemTwo = true;
                  this.setItemThree = true;
                } else {
                  this.setItemOne = true;
                  this.setItemTwo = true;
                }
              } else {
                this.setItemOne = true;
              }
            }
            for (var i = 0; i < atts.length; i++) {
              if (atts[i].txtItemType == 'Glass') {
                this.glassAttStatus = true;
                if (atts[i].txtParameter == 'mm')
                  this.glassAtt1.push(atts[i])
                else if (atts[i].txtParameter == 'µm')
                  this.glassAtt2.push(atts[i])
                else if (atts[i].txtParameter == 'g')
                  this.glassAtt3.push(atts[i])
                else if (atts[i].txtValueType == 'Boolean')
                  this.glassAtt4.push(atts[i])
                else
                  this.glassAtt5.push(atts[i])
              } else if (atts[i].txtItemType == 'Case') {
                this.caseAttStatus = true;
                if (atts[i].txtParameter == 'mm')
                  this.caseAtt1.push(atts[i])
                else if (atts[i].txtParameter == 'µm')
                  this.caseAtt2.push(atts[i])
                else if (atts[i].txtParameter == 'g')
                  this.caseAtt3.push(atts[i])
                else if (atts[i].txtValueType == 'Boolean')
                  this.caseAtt4.push(atts[i])
                else
                  this.caseAtt5.push(atts[i])
              } else if (atts[i].txtItemType == 'Frame Standard') {
                this.frameSAttStatus = true;
                if (atts[i].txtParameter == 'mm')
                  this.frameSAtt1.push(atts[i])
                else if (atts[i].txtParameter == 'µm')
                  this.frameSAtt2.push(atts[i])
                else if (atts[i].txtParameter == 'g')
                  this.frameSAtt3.push(atts[i])
                else if (atts[i].txtValueType == 'Boolean')
                  this.frameSAtt4.push(atts[i])
                else
                  this.frameSAtt5.push(atts[i])
              } else if (atts[i].txtItemType == 'Frame Eco') {
                this.frameEAttStatus = true;
                if (atts[i].txtParameter == 'mm')
                  this.frameEAtt1.push(atts[i])
                else if (atts[i].txtParameter == 'µm')
                  this.frameEAtt2.push(atts[i])
                else if (atts[i].txtParameter == 'g')
                  this.frameEAtt3.push(atts[i])
                else if (atts[i].txtValueType == 'Boolean')
                  this.frameEAtt4.push(atts[i])
                else
                  this.frameEAtt5.push(atts[i])
              }
            }
          })
      }
    },
    getItem() {
      if (!this.error) {
        let endpoint = `/api/item-list/`;
        apiService(endpoint)
          .then(data => {
            this.items.push(...data.results);
            this.optionItem = this.items
            const mapType = new Map();
            const mapVersion = new Map();
            for (const item of this.items) {
              if(!mapType.has(item.txtType)){
                mapType.set(item.txtType, true);
                this.optionItemType.push(item.txtType);
              }
            }
          })
          .catch(err => console.log(err));
      }
    },
    getManufacturer() {
      if (!this.error) {
        let endpoint = `/api/manufacturer/`;
        apiService(endpoint)
          .then(data => {
            this.manufacturers.push(...data.results);
            this.optionManufacturer = this.manufacturers
          })
          .catch(err => console.log(err));
      }
    },
    getSupplier() {
      if (!this.error) {
        let endpoint = `/api/supplier/`;
        apiService(endpoint)
          .then(data => {
            this.suppliers.push(...data.results);
            this.optionSupplier = this.suppliers
          })
          .catch(err => console.log(err));
      }
    },
    getModel() {
      if (!this.error) {
        let endpoint = `/api/model/`;
        apiService(endpoint)
          .then(data => {
            this.models.push(...data.results);
            this.optionModel = this.models
          })
          .catch(err => console.log(err));
      }
    },
    getOrderDevice() {
      if (!this.error) {
        let endpoint = `/api/order-device-list/`;
        apiService(endpoint)
          .then(data => {
            this.devices.push(...data.results);
            this.optionOrderDevice = this.devices
          })
          .catch(err => console.log(err));
      }
    },
    getOrderItem() {
      if (!this.error) {
        let endpoint = `/api/order-item-list/`;
        apiService(endpoint)
          .then(data => {
            this.orderItems.push(...data.results);
            this.optionOrderItem = this.orderItems
          })
          .catch(err => console.log(err));
      }
    },
    getSuperuser() {
      let el = localStorage.getItem("superuser");
      if(el == 'true') {
        this.Superuser = false;
      } else {
        this.Superuser = true;
      }
    },
  },
  created() {
    this.getTemplate();
    this.getItem();
    this.getManufacturer();
    this.getSupplier();
    this.getModel();
    this.getOrderDevice();
    this.getOrderItem();
    this.getInspectionNumber();
    this.getSuperuser();
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

  .input-group-append, .input-group-prepend, .dropdown-toggle {
    width: 50%!important;
  }
    .input-group-text {
    width: 100%!important;
  }
  @media print {
    html, body {
      box-sizing: border-box!important;
    }
  }
  #card-notes {
    background-color: #d1c7b2;
  }
  #card-device {
    background-color: #b2c2d1;
  }
  #card-item-1 {
    background-color: #bab2d1;
  }
  #card-item-2 {
    background-color: #b88ba0;
  }
  #card-item-3 {
    background-color: #759097;
  }
  .vs__dropdown-toggle {
    background-color: white;
  }
  .divider {
    border: solid 1px rgba(141, 141, 141, 0.404);
  }
  .input-group-text {
    font-weight: 800!important;
  }

</style>
