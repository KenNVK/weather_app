import axios from "axios";
const mapboxKey = process.env.VUE_APP_MAPBOX_API_KEY;
const mapboxUrl = process.env.VUE_APP_MAPBOX_API_URl;

export default async (req, res) => {
  const { name } = req.query;
  try {
    if (name) {
      const response = await axios.get(
        encodeURI(
          `${mapboxUrl}/${name}.json?access_token=${mapboxKey}&types=country,locality,place&limit=5&autocomplete=true`
        )
      );
      return res.json(response.data);
    }
    return res.json([]);
  } catch (error) {
    console.log(error);
  }
};
