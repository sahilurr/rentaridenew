import PropTypes from 'prop-types';
import { addVehicleClicked } from '../../../redux/adminSlices/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const Header = ({category,title}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  //add vehicle admin
  const handleAddVehicle = () => {
    dispatch(addVehicleClicked(true));
    navigate('/adminDashboard/addProducts')
  };

  return (
    <div className="mb-10 flex justify-between items-center ">
      <div>
      <p className="text-gray-400">
        {category}
      </p>
      <p className="text-slate--900 text-3xl font-extrabold tracking-tight ">
        {title}
      </p>
      </div>
      <button className='bg-blue-600 rounded-lg '>
        <div className='text-white px-5 py-2 font-bold ' onClick={handleAddVehicle}>Add+</div>
      </button>
      
        
    </div>
  )
}
Header.propTypes = {
  category:PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Header