import java.util.*;
class IndexReturn {
    public int[] twoSum(int[] nums, int target) {
        Scanner sc= new Scanner(System.in);
        int[] result=new int[2];
        for(int i=0;i<=nums.length;i++){
            nums[i]=sc.nextInt();
        }
        target=sc.nextInt();
        for(int i=0;i<=nums.length;i++){
            if(nums[i]+nums[i+1]==target)
            result[0]=i;
            result[1]=i+1;
            
        }
        return result;
         
    }
}