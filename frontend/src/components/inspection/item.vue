<template>
  <div class="row mt-3">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body p-0 mb-3 mt-3">
          <h5 class="card-title p-3 pb-0 mb-0 ml-2">{{ ParameterTitle }}</h5>
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
</template>

<script>
export default {
    props:['ParameterTitle','wiCardOneText','wiCardLButton','wiCardRButton','wiImageUrlOne','wiCardLButtonColor','wiCardRButtonColor'],
    data()
    {
        return{
            // imgLink:require('@/assets/images/products/iphone-1.jpg')
        }
    }
}
</script>

<style>

</style>