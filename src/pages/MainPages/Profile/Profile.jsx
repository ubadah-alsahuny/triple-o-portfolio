import styles from "./Profile.module.css";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal.jsx";
import axios from "axios";
import Work from "../../../components/Work Experience/Work.jsx";
import Rating from "../../../components/Rating/Rating.jsx";
import { FaGenderless, FaLocationArrow, FaMobile } from "react-icons/fa";
import Card from "../../../components/Portfolio Card/Card.jsx";
import { RiUserSmileFill } from "react-icons/ri";
import { SiReaddotcv, SiSitecore } from "react-icons/si";
import Information from "../../../components/Information/Information.jsx";
import { MdCake, MdEmail } from "react-icons/md";
import noPFP from '../../../assets/no profile picture.png'

const Profile = () => {
  const [imageAfterCrop, setImageAfterCrop] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [view, setView] = useState(1);
  const token = localStorage.getItem("auth_token");

  const { user, setUser, loading } = useAuth(); // <-- pull in setUser

  const displayName = user?.name || "User name";
  const displayDescription = user?.description || "";
  const displayMail = user?.email || "";

  useEffect(() => {
    if (!loading && user?.id) {
      fetchProfile();
    }
  }, [loading, user?.id]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/profile/${user.id}`
      );
      const data = response.data.data;

      // Update global state via context
      setUser((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
        description: data.description,
        profilePhotoPath: data.profilePhotoPath,
        occupation: data.occupation,
        skills: data.skills || [],
      }));
      // Update local photo only if needed
      setProfilePhoto(
          data.profilePhotoPath
              ? `http://localhost:8000/storage/${data.profilePhotoPath}`
              : noPFP
      );
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };
  function updateView(id) {
    setView(id);
  }

  const deleteProfilePhoto = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/profile/photo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data;

      if (response.data === 200) {
        console.log(data.data);
        setProfilePhoto(" ✔👍 ");
      }
    } catch (err) {
      console.error("Error Deleting the photo:", err);
    }
  };

  if (!token) return null;

  return (
    <div className={`h-full w-full flex overflow-x-hidden`}>
      <div className={`h-full w-1/4 flex-col`}>
        <div className={`h-1/2 w-full content-center place-items-center`}>
          <div className={`w-60 h-60 ${styles.imageBg}`}>
            <img
              className={`w-full h-full object-cover object-center ${styles.pfp}`}
              src={imageAfterCrop || profilePhoto}
              alt={""}
            />
          </div>
        </div>

        <div className={`h-1/2 w-full`}>
          <div className={`h-fit px-12`}>
            <p className={`flex place-items-center ${styles.titles}`}>WORK</p>

            <Work
              title="Portfolio Company"
              isPrimary={true}
              role="Front-end Developer"
              jobDescription="A rising company in making interactive portfolios."
            />

            <Work
              title="Translation Team"
              isPrimary={false}
              role="Translator + Designer"
              jobDescription="A solo team dedicated to translating academic papers to those in need."
            />

            <Work
              title="English Club Supervisor"
              isPrimary={false}
              role="Supervisor/Leader"
              jobDescription="A program to help and aid people that are trying to achieve a decent English level."
            />

            <p className={`flex place-items-center ${styles.titles}`}>SKILLS</p>

            <ul className={`my-1 px-2 text-black pb-12`}>
              {user?.skills?.length > 0 ? (
                user.skills.map((skill) => (
                  <li key={skill.id} className={styles.item}>
                    {skill.name}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No skills added</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className={`h-full w-3/4 flex-col pr-4 pb-6`}>
        <div className={`h-1/2 w-full pt-9 flex flex-col justify-evenly`}>
          <div>
            <div className={`text-black flex place-items-center`}>
              <p className={`${styles.name}`}>{displayName}</p>
              <FaLocationArrow size={17} className={`ml-7 ${styles.shared}`} />
              <p className={`ml-4 ${styles.location} ${styles.shared}`}>
                Salamiyah, Hamah, Syria
              </p>
            </div>
            <p className={`ml-1 ${styles.occupation}`}>
              {user?.occupation
                ? typeof user.occupation === "string"
                  ? user.occupation
                  : user.occupation.name
                : "No occupation"}
            </p>
          </div>

          <div>
            <p className={`ml-1 ${styles.shared}`}>{displayDescription}</p>
          </div>

          <div>
            <p className={`ml-1 ${styles.shared}`}>Rankings</p>
            <Rating />
          </div>

          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
              <li
                className={
                  view === 1
                    ? "me-2 inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group cursor-pointer"
                    : "me-2 inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                }
                onClick={() => updateView(1)}
              >
                <RiUserSmileFill size={20} className={`mr-3`} />
                About
              </li>
              <li
                className={
                  view === 2
                    ? "me-2 inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group cursor-pointer"
                    : "me-2 inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                }
                onClick={() => updateView(2)}
              >
                <SiReaddotcv size={20} className={`mr-3`} />
                Portfolios
              </li>
            </ul>
          </div>
        </div>

        <div
          className={
            view === 1 ? `h-fit w-full text-black` : `${styles.setInvisible}`
          }
        >
          <div className={`mb-5`}>
            <button
              className={`${styles.editButton}`}
              onClick={() => setIsEditOpen(true)}
            >
              Edit profile
            </button>
          </div>

          <div className={`mb-10`}>
            <p className={`${styles.titles} tracking-tighter scale-y-95 mb-5`}>
              CONTACT INFORMATION:
            </p>
            <Information
              icon={<FaMobile size={17} className={`mr-3 -rotate-20`} />}
              label="Phone"
              content="+963 981 080 236"
            />

            <Information
              icon={<FaLocationArrow size={17} className={`mr-3`} />}
              label="Location"
              content="Aleppo - AlFurqan - University dormitory"
            />

            <Information
              icon={<MdEmail size={17} className={`mr-3`} />}
              label="E-mail"
              content={displayMail}
              isEmail={true}
            />

            <Information
              icon={<SiSitecore size={17} className={`mr-3`} />}
              label="Site"
              content="N/A"
            />
          </div>

          <div>
            <p className={`${styles.titles} tracking-tighter scale-y-95 mb-5`}>
              BASIC INFORMATION:
            </p>
            <Information
              icon={<MdCake size={17} className={`mr-3`} />}
              label="Birthday"
              content="16 - November - 2003"
            />

            <Information
              icon={<FaGenderless size={17} className={`mr-3`} />}
              label="Gender"
              content="Male"
            />
          </div>
        </div>

        <div
          className={
            view === 2
              ? `h-fit w-full md:columns-2 sm:columns-1 lg:columns-3 xl:columns-3 2xl:columns-5`
              : `${styles.setInvisible}`
          }
        >
          <Card
            thumbnail="https://market-resized.envatousercontent.com/previews/files/315264548/590x300.png?w=590&h=300&cf_fit=crop&crop=top&format=auto&q=85&s=d39355977cf6e2849802675bf89fcd3d0ac141b10e231c60641d0a89fbbad57d"
            title="Figma Portfolio"
            description="This is a portfolio for Figma, where the desginer is expressing himself through his designs and creativity. His LinkedIn profile is linked withing the prtofolio."
            isProfile={true}
          />

          <Card
            thumbnail="https://instawp.com/wp-content/uploads/2025/05/image-15-1024x668.png"
            title="Another very long titled Portfolio"
            description="This is a portfolio that has a long title and a description"
            isProfile={true}
          />

          <Card
            thumbnail="https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/6673696d1346b25a072ca8a2_667078ae17e27a56b024b255_AD_4nXfbBe-L4QdOc3LubLALLGcgSldjPYX8Q1zS6HepOMPVSZ-fCOgZIgoh-cX23hfv662PlOidtMtnfc04KMX9wTHnguOXBALrQ1KW57VFz4CSaJDbC069YI38Kv2tm9RcowFg2Ha-isaU3rPFLZTsH65DVr_T.png"
            title="Another Portfolio"
            description="This is a portfolio."
            isProfile={true}
          />

          <Card
            thumbnail="https://colorlib.com/wp/wp-content/uploads/sites/2/19_best-portfolio-websites.jpg"
            title="Another long titled Portfolio"
            description="This is a portfolio that has a long title and a description"
            isProfile={true}
          />

          <Card
            thumbnail="https://cdn.prod.website-files.com/61128b733135bb5e71c1519f/64a5db07eb8d8564f2e0d1fb_webflow-portfolio.webp"
            title="Another long titled Portfolio"
            description="This is a portfolio that has a long title and a description"
            isProfile={true}
          />

          <Card
            thumbnail="https://onemob.com/wp-content/uploads/2022/12/1-Why-consultants-need-portfolios-1.png"
            title="Another long titled Portfolio"
            description="This is a portfolio that has a long title and a description"
            isProfile={true}
          />
        </div>
      </div>

      <div
        className={
          isEditOpen
            ? `fixed h-full w-full content-center place-items-center bg-black/75`
            : `${styles.setInvisible}`
        }
      >
        <div className={`w-fit h-fit p-0.5 bg-white ${styles.modal}`}>
          <div className={`w-fit h-fit bg-white p-7 ${styles.pfp}`}>
            <EditProfileModal
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              initialName={displayName}
              initialDescription={displayDescription}
              initialOccupationId={user?.occupation?.id ?? null}
              initialSkillIds={user?.skills?.map((s) => s.id) ?? []}
              onSave={() => {
                fetchProfile();
                setIsEditOpen(false);
              }}
              onDeletePhoto={() => {
                deleteProfilePhoto();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
