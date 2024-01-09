import { getExpectedRevenue } from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
const ExpectedRevenue = ({ previous_batch_id }) => {
  const { getToken } = useAuth();
  const where = {
    batch_id: {
      _eq: previous_batch_id,
    },
    is_deleted: {
      _eq: false,
    },
    end_at: {
      _is_null: true,
    },
    next_batch_money: {
      _lt: 0,
    },
  };

  const expectedRevenue = useQuery({
    queryKey: ["get_expected_revenue"],
    queryFn: async () =>
      getExpectedRevenue(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        }),
        where
      ),
  });

  console.log(expectedRevenue.data);
  return <div>ExpectedRevenue</div>;
};

export default ExpectedRevenue;
