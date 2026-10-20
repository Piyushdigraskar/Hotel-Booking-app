export const createRoom = async (req, res) => {
  try {
    const {roomType, pricePerNight, amenities}= req.body;
    const hotel = await Hotel.findOne({owner: req.auth.userId});
    if(!hotel){
        return res.status(404).json({success: false, message: "No hotel Found"});
    }
    

  } catch (error) {}
};

export const getRooms = async (req, res) => {
  try {
  } catch (error) {}
};

export const getOwnerRooms = async (req, res) => {
  try {
  } catch (error) {}
};

export const toggleRoomAvailability = async (req, res) => {
  try {
  } catch (error) {}
};
