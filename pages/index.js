import { supabase } from "../utils/supabase";
import Link from 'next/link';
import { useUser } from "../provider/user";

const Home = ({ lessons }) => {
  const { user } = useUser();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {
        lessons.map(lesson => (
          <Link
            key={lesson.id}
            href={`/${lesson.id}`}
          >
            <a className="p-8 h-40 mb-4 rounded shadow text-xl flex">
              {lesson.title}
            </a>
          </Link>
        ))
      }
    </div>
  )
};

export default Home;

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from("lesson").select("*");
  return {
    props: {
      lessons,
    },
  }
};
