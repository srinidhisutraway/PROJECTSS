public class NextNumber {//ceiling of a number which is just next samller to it!!
    public static void main(String[] args) {
        int[] arr={2,4,6,9,12,18,24};
        int target=5;
        System.out.println(SolveC(arr,target)); 

        
    }
    static int SolveC(int[] arr,int target){
        int start=4;
        int end=0;
       
        while(start>=end){
            int mid=(start+end)/2;
            if(target<arr[mid]){
                end= mid+1;
            }
            else if(target>arr[mid]){
                start= mid-1;
            }
            
            else return mid; 
        }
        return -1;
    }
    
}

