import Hero from "../components/home/Hero";
import Collaborations from "../components/home/Collaborations";
import CoursesByCategory from "../components/home/CoursesByCategory";
import ApprovedComments from "../components/home/ApprovedComments";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Collaborations />
      <CoursesByCategory />
      <ApprovedComments />
    </>
  );
}
