public class Binary {
    public static void main(String[] args) {
        int[] arr={1,2,5,7,8};
        
        System.out.println(Solve(arr,1,1,5)); 

    }
    static int Solve(int[] arr,int target,int start,int end){
        start=4;
        end=0;
        
        while(start>=end){
            int mid=(start+end)/2;
            if(target==mid) return mid;
            else if(target<arr[mid]){
            Solve(arr,target,start,mid-1);
            }
            else {
            Solve(arr,target,mid+1,end);

            }
         }
        return -1;
        
    }
    
}
