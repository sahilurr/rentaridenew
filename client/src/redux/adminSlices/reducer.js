const initial_state = {
  isAddVehicleClicked: false,
  editData:{
    _id:null,
    registeration_number:null,
    company:null,
    name:null,
  },
  imageUpload: {
    loading: false,
    error: null,
    imageUrl: '',
 },
 
};

const AddVehiclereducer = (state = initial_state, action) => {
  switch (action.type) {
    case "Add_vehicle_clicked":
      return { ...state, isAddVehicleClicked: action.payload };
    case "Set_edit_data":
      return {...state,editData:action.payload}
    case "upload_image_start":
      return {...state,imageUpload:{...state.imageUpload,loading:true,error:null}};
    case "upload_image_success":
      return {...state,imageUpload:{...state.imageUpload,loading:false,error:null,imageUrl:action.payload}}
    case "upload_image_fail":
      return {...state,imageUpload:{...state.imageUpload,loading:false,error:action.payload}}
    default:
      return state;
  }
};

export default AddVehiclereducer;



